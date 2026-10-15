import {build,createServer} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {googleRating} from '../src/content.js';
await build();
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
const {default:App}=await server.ssrLoadModule('/src/App.jsx');
const {pageMeta}=await server.ssrLoadModule('/src/pages.jsx');
const template=await readFile('dist/index.html','utf8');
const origin=process.env.SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'');
if(origin&&(!/^https?:\/\//.test(origin)||new URL(origin).origin!==origin))throw Error('SITE_URL must be a full origin without a trailing slash, e.g. https://example.com');
const escape=text=>text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const [slug,meta]of Object.entries(pageMeta)){
const title=`${meta.title} – Jubilee Retreat & Conference Centre`;
const content=renderToString(React.createElement(App,{pathname:'/'+slug}));
const social=`<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:site_name" content="Jubilee Retreat & Conference Centre"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">${origin?`<meta property="og:image" content="${origin}/assets/images/pool-sunset.jpg"><link rel="canonical" href="${origin}/${slug}">`:''}`;
const schema={'@context':'https://schema.org','@type':['LodgingBusiness','EventVenue'],name:'Jubilee Retreat & Conference Centre',telephone:'+2348103150133',address:{'@type':'PostalAddress',streetAddress:'No. 5 Enerhen Road',addressLocality:'Effurun',addressRegion:'Delta State',addressCountry:'NG'},aggregateRating:{'@type':'AggregateRating',ratingValue:googleRating.score,reviewCount:googleRating.count,bestRating:5}};
const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(meta.description)}">`).replace('</head>',social+`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`).replace('<div id="root"></div>',`<div id="root">${content}</div>`).replace('<body>',`<body class="page-${slug||'home'}">`);
await writeFile(`dist/${slug||'index'}.html`,html);
}
await writeFile('dist/404.html',template.replace('<div id="root"></div>',`<div id="root">${renderToString(React.createElement(App,{pathname:'/404'}))}</div>`).replace('</head>','<meta name="robots" content="noindex"></head>'));
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\n');
if(origin)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pageMeta).map(slug=>`<url><loc>${origin}/${slug}</loc></url>`).join('')}</urlset>`);
console.log(`Pre-rendered ${Object.keys(pageMeta).length} React routes and a 404 page.`);
}finally{await server.close();}
