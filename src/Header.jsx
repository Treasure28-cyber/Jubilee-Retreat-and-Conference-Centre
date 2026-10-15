import React,{useRef,useState} from 'react';
import Logo from './Logo.jsx';

const experiences=[['events','Events'],['rooms','Rooms'],['restaurant','Restaurant'],['pool','Pool']];
const discover=[['gallery','Gallery'],['about','About'],['contact','Contact']];
const navigation=[...experiences,...discover];

function Chevron(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg>;}

export default function Header({slug}){
  const dialog=useRef(null);
  const trigger=useRef(null);
  const [open,setOpen]=useState(false);
  function close(){dialog.current.close();}
  function openMenu(){dialog.current.showModal();setOpen(true);document.body.classList.add('locked');}
  function item(id,text,index){return <a key={id} href={'/'+id} aria-current={slug===id?'page':undefined} onClick={close}><span className="menu-index" aria-hidden="true">{String(index).padStart(2,'0')}</span><span>{text}</span><Chevron/></a>;}
  return <>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="/" aria-label="Jubilee home"><Logo/></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([id,text])=><a key={id} href={'/'+id} aria-current={slug===id?'page':undefined}>{text}</a>)}</nav>
      <a className="button gold" href="/events#enquiry">Plan an Event</a>
      <button ref={trigger} className="menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={openMenu}><span/><span/></button>
    </div></header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Main navigation" onClick={event=>{if(event.target===dialog.current)close();}} onClose={()=>{setOpen(false);document.body.classList.remove('locked');trigger.current?.focus();}}>
      <div className="menu-shell">
        <div className="menu-heading">
          <a className="brand" href="/" aria-label="Jubilee home" onClick={close}><Logo/></a>
          <button className="menu-close" aria-label="Close menu" onClick={close}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg></button>
        </div>
        <div className="menu-scroll">
          <nav className="menu-nav" aria-label="Mobile navigation">
            <a className="menu-home" href="/" aria-current={slug===''?'page':undefined} onClick={close}><span className="menu-index" aria-hidden="true">00</span><span>Home</span><Chevron/></a>
            <section className="menu-group" aria-labelledby="menu-experiences"><h2 id="menu-experiences">Your Jubilee experience</h2>{experiences.map(([id,text],index)=>item(id,text,index+1))}</section>
            <section className="menu-group" aria-labelledby="menu-discover"><h2 id="menu-discover">Discover the centre</h2>{discover.map(([id,text],index)=>item(id,text,index+5))}</section>
          </nav>
        </div>
        <div className="menu-actions">
          <p>Let’s plan your visit.</p>
          <div className="menu-action-buttons"><a className="button gold" href="/events#enquiry" onClick={close}>Plan an Event</a><a className="button outline" href="/rooms#booking" onClick={close}>Book a Room</a></div>
          <a className="menu-call" href="tel:+2348103150133"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3c-1 4-4 5-8 3C8 18 4 14 3 9 2 5 4 3 7 3Z" stroke="currentColor" strokeWidth="1.5"/></svg><span>Speak with us · 0810 315 0133</span></a>
        </div>
      </div>
    </dialog>
  </>;
}
