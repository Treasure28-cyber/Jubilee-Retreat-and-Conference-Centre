import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
process.on('uncaughtException',error=>{process.stderr.write(`${error.name}: ${error.message}\n`);process.exit(1);});
if(!process.argv[2]){
  for(const route of ['home','events','rooms','restaurant','pool','gallery','about','contact','404'])console.log(execFileSync(process.execPath,[import.meta.filename,route],{encoding:'utf8',timeout:30000}).trim());
}else{
  const {JSDOM}=await import('jsdom');
  const route=process.argv[2];const html=await readFile(`dist/${route==='home'?'index':route}.html`,'utf8');
  const dom=new JSDOM(html,{url:`https://jubilee.test/${route==='home'?'':route}`,pretendToBeVisual:true});
  const safeguards=dom.window.document.createElement('style');safeguards.textContent=await readFile('src/mobile-fixes.css','utf8');dom.window.document.head.append(safeguards);
  for(const key of ['window','document','location','navigator','HTMLElement','HTMLDialogElement','Node','MutationObserver','Event','MouseEvent','FormData','requestAnimationFrame','cancelAnimationFrame','getComputedStyle'])Object.defineProperty(globalThis,key,{configurable:true,value:typeof dom.window[key]==='function'&&['requestAnimationFrame','cancelAnimationFrame','getComputedStyle'].includes(key)?dom.window[key].bind(dom.window):dom.window[key]});
  // jsdom does not implement native dialog methods; keep the open/close contract.
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new Event('close'));};
  const errors=[];console.error=(...args)=>errors.push(args.join(' '));window.addEventListener('error',e=>errors.push(e.message));
  let opened;window.open=(...args)=>{opened=args;return null;};
  let intersectionCallback;window.IntersectionObserver=class{constructor(callback){intersectionCallback=callback;}observe(){}disconnect(){}};
  const bundle=html.match(/<script type="module"[^>]*src="([^"]+)"/)[1];
  await import(new URL('../dist'+bundle,import.meta.url));
  const settle=()=>new Promise(resolve=>setTimeout(resolve,80));await settle();
  const click=async element=>{assert(element,'Expected interactive element');element.dispatchEvent(new MouseEvent('click',{bubbles:true}));await settle();};
  await click(document.querySelector('.menu-toggle'));assert(document.querySelector('#mobile-menu').open);assert(document.body.classList.contains('locked'));
  const mobileNav=document.querySelector('#mobile-menu .menu-nav');assert.equal(mobileNav.querySelectorAll('a').length,8);assert.equal(mobileNav.querySelectorAll('.menu-group').length,2);const selected=mobileNav.querySelector('[aria-current="page"]');if(route!=='404')assert.equal(selected.getAttribute('href'),route==='home'?'/':'/'+route);assert.equal(document.querySelectorAll('#mobile-menu .menu-action-buttons a').length,2);
  await click(document.querySelector('.menu-close'));assert(!document.querySelector('#mobile-menu').open);assert(!document.body.classList.contains('locked'));assert.equal(document.activeElement,document.querySelector('.menu-toggle'));
  for(const dialog of document.querySelectorAll('dialog:not([open])'))assert.equal(getComputedStyle(dialog).display,'none','Closed dialogs cannot create blank space');assert.equal(getComputedStyle(document.querySelector('#mobile-menu')).position,'fixed');
  intersectionCallback([{target:document.querySelector('footer'),isIntersecting:true}]);await settle();assert(document.querySelector('.whatsapp').hidden,'Floating contact hides over footer');intersectionCallback([{target:document.querySelector('footer'),isIntersecting:false}]);await settle();assert(!document.querySelector('.whatsapp').hidden);
  if(route==='home'){
    assert.equal(document.querySelector('.site-header .logo-mark').getAttribute('src'),'/assets/logo.svg');
    const activeForm=()=>document.querySelector('[role="tabpanel"]:not([hidden]) .quick-booking');
    const change=async(id,value)=>{const el=document.getElementById(id);Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?window.HTMLSelectElement.prototype:window.HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await settle();};
    assert.equal(document.querySelector('#booking-title').textContent,'Plan with us');
    assert.equal(document.querySelectorAll('.booking-tabs [role="tab"]').length,3);
    activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(opened,undefined,'A date is required');
    await change('quick-eventDate','2027-03-20');await change('quick-eventGuests','120');await change('quick-eventType','Wedding');activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(opened);const eventMessage=new URL(opened[0]).searchParams.get('text');assert(eventMessage.includes('20 March 2027'));assert(eventMessage.includes('Guests: 120'));assert(eventMessage.includes('Event type: Wedding'));assert(!eventMessage.includes('Check-in'));
    await change('quick-eventGuests','');activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(!new URL(opened[0]).searchParams.get('text').includes('Guests:'),'Empty optional fields are omitted');
    await click(document.querySelector('#quick-tab-room'));opened=undefined;assert(document.querySelector('#quick-panel-event').hidden);assert.equal(document.querySelector('#quick-room').value,'Help me choose');
    await change('quick-checkIn','2027-02-10');await change('quick-checkOut','2027-02-09');activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert.equal(opened,undefined);assert(document.querySelector('#quick-panel-room .form-error'));
    await change('quick-checkOut','2027-02-12');await change('quick-roomGuests','4');await change('quick-room','Deluxe Classic');activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(opened,'Booking must open WhatsApp');const url=new URL(opened[0]);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/2348103150133');const message=url.searchParams.get('text');assert(message.includes('10 February 2027'));assert(message.includes('12 February 2027'));assert(message.includes('Guests: 4'));assert(message.includes('Deluxe Classic'));assert(document.querySelector('#quick-panel-room .booking-fallback a').href===new URL(opened[0]).href);
    document.querySelector('#quick-tab-room').dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();assert.equal(document.activeElement.id,'quick-tab-table');assert.equal(document.querySelector('#quick-tab-table').getAttribute('aria-selected'),'true');
    await change('quick-tableDate','2027-04-10');await change('quick-time','18:30');await change('quick-tableGuests','6');activeForm().dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();const tableMessage=new URL(opened[0]).searchParams.get('text');assert(tableMessage.includes('reserve a table'));assert(tableMessage.includes('10 April 2027'));assert(tableMessage.includes('18:30'));assert(tableMessage.includes('Guests: 6'));assert(!tableMessage.includes('Room:'));
    await click(document.querySelector('#quick-tab-event'));assert.equal(document.getElementById('quick-eventDate').value,'2027-03-20','Switching tabs preserves entered details');
    intersectionCallback([{target:document.querySelector('.booking-card'),isIntersecting:true}]);await settle();assert(document.querySelector('.whatsapp').hidden,'Floating WhatsApp must not cover the form');
    assert(document.querySelector('.google-rating').textContent.includes('989 Google reviews'));assert(document.querySelector('meta[name="description"]').content.includes('4.1 on Google from 989 reviews'));assert.equal(document.querySelectorAll('footer a[href^="mailto:"]').length,0,'Do not invent an email address');
  }
  if(route==='gallery'){
    await click([...document.querySelectorAll('.filter')].find(x=>x.textContent==='Rooms'));assert.equal(document.querySelectorAll('.gallery-item').length,1);await click(document.querySelector('.gallery-item'));assert(document.querySelector('.lightbox').open);await click(document.querySelector('.lightbox-close'));assert(!document.body.classList.contains('locked'));
  }
  if(route==='contact'){
    await click(document.querySelector('#tab-table'));assert.equal(document.querySelector('#tab-table').getAttribute('aria-selected'),'true');assert(!document.querySelector('#panel-table').hidden);
    const form=document.querySelector('#panel-table form');form.elements.Name.value='Test Guest';form.elements.Phone.value='+2348100000000';form.elements.Date.value='2027-01-20';form.elements.Time.value='13:00';form.elements.Guests.value='4';form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(form.hidden);const send=document.querySelector('#panel-table .request-ready a');assert(decodeURIComponent(send.href).includes('Guests: 4'));assert(decodeURIComponent(send.href).includes('Test Guest'));await click(document.querySelector('#panel-table .request-ready button'));assert(!form.hidden);
  }
  if(route==='events'){await click(document.querySelector('.hall-select'));assert.equal(document.querySelector('select[name="Hall"]').value,'Celebration hall setup');}
  if(route==='rooms'){
    const form=document.querySelector('form');form.elements.Name.value='Test Guest';form.elements.Phone.value='123';form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(document.querySelector('.form-error').textContent.includes('valid phone'));form.elements.Phone.value='+2348100000000';form.elements['Check-in'].value='2027-02-10';form.elements['Check-out'].value='2027-02-09';form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await settle();assert(document.querySelector('.form-error').textContent.includes('after your check-in'));
  }
  assert.deepEqual(errors,[],`${route}: React hydration/runtime errors`);console.log(`${route}: React hydration and applicable interactions passed`);dom.window.close();
}
