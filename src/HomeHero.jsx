import React, {useEffect, useRef, useState} from 'react';
import {rooms} from './components.jsx';
import {centreContact} from './content.js';
import SectionLabel from './SectionLabel.jsx';

const tabs = [['event','Plan an Event'], ['room','Book a Room'], ['table','Reserve a Table']];
const eventTypes = ['Wedding','Conference','Seminar or training','Corporate meeting','Birthday or anniversary','Other'];
const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const initialDetails = {eventType:'Wedding',eventDate:'',eventGuests:'',checkIn:'',checkOut:'',roomGuests:'2',room:'Help me choose',tableDate:'',time:'',tableGuests:'2'};

export function BookingCard() {
  const [active,setActive] = useState('event');
  const [details,setDetails] = useState(initialDetails);
  const [today,setToday] = useState('');
  const [error,setError] = useState('');
  const [whatsapp,setWhatsapp] = useState('');
  const tabRefs = useRef([]);
  useEffect(()=>setToday(localDate(new Date())),[]);

  function update(name,value) {
    setDetails(previous=>({...previous,[name]:value}));
    setError('');
    setWhatsapp('');
  }
  function chooseTab(id) { setActive(id); setError(''); setWhatsapp(''); }
  function navigateTabs(event,index) {
    const next = event.key==='ArrowRight' ? (index+1)%3 : event.key==='ArrowLeft' ? (index+2)%3 : event.key==='Home' ? 0 : event.key==='End' ? 2 : null;
    if(next===null)return;
    event.preventDefault(); chooseTab(tabs[next][0]); tabRefs.current[next]?.focus();
  }
  function submit(event) {
    event.preventDefault();
    const date = active==='event' ? details.eventDate : active==='room' ? details.checkIn : details.tableDate;
    if(!date || date<today) { setError('Please choose a date from today onwards.'); return; }
    if(active==='room' && (!details.checkOut || details.checkOut<=details.checkIn)) { setError('Please choose a check-out date after your check-in date.'); return; }
    if(active==='event' && details.eventGuests && (!Number.isInteger(Number(details.eventGuests)) || Number(details.eventGuests)<1 || Number(details.eventGuests)>10000)) { setError('Please enter a valid number of guests.'); return; }
    const format = value => value ? new Intl.DateTimeFormat('en-NG',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00')) : '';
    const heading = active==='event' ? "Hello, I'd like to plan an event at Jubilee." : active==='room' ? "Hello, I'd like to book a room at Jubilee." : "Hello, I'd like to reserve a table at Jubilee.";
    const rows = active==='event' ? [['Event type',details.eventType],['Date',format(details.eventDate)],['Guests',details.eventGuests]] : active==='room' ? [['Check-in',format(details.checkIn)],['Check-out',format(details.checkOut)],['Guests',details.roomGuests],['Room',details.room]] : [['Date',format(details.tableDate)],['Time',details.time],['Guests',details.tableGuests]];
    const message = heading+'\n\n'+rows.filter(([,value])=>value).map(([name,value])=>`${name}: ${value}`).join('\n')+'\n\nPlease confirm availability and rates. Thank you.';
    const url = `https://wa.me/${centreContact.phone}?text=${encodeURIComponent(message)}`;
    setError(''); setWhatsapp(url);
    document.activeElement?.blur();
    window.open(url,'_blank','noopener,noreferrer');
  }
  const nextDay = details.checkIn ? localDate(new Date(new Date(details.checkIn+'T12:00:00').getTime()+86400000)) : today;
  const input = (name,label,type='text',options={}) => <label className={options.full?'booking-field-wide':undefined} htmlFor={'quick-'+name}>{label}<input id={'quick-'+name} name={name} type={type} value={details[name]} onChange={event=>update(name,event.target.value)} required={options.required} min={type==='date'?(options.min||today):type==='number'?1:undefined} max={type==='number'?10000:undefined} inputMode={type==='number'?'numeric':undefined} placeholder={type==='number'?'Guest count':undefined}/></label>;
  const select = (name,label,options,full=false) => <label className={full?'booking-field-wide':undefined} htmlFor={'quick-'+name}>{label}<select id={'quick-'+name} name={name} value={details[name]} onChange={event=>update(name,event.target.value)}>{options.map(option=>{const [value,text]=Array.isArray(option)?option:[option,option];return <option key={value} value={value}>{text}</option>;})}</select></label>;
  const guestOptions = [1,2,3,4,5,6].map(n=>[String(n),`${n} ${n===1?'guest':'guests'}`]).concat([['7+','7+ guests']]);

  return <aside className="booking-card" aria-labelledby="booking-title" id="plan-your-visit">
    <div className="booking-tabs" role="tablist" aria-label="Plan your visit">
      {tabs.map(([id,text],index)=><button key={id} type="button" role="tab" id={'quick-tab-'+id} aria-controls={'quick-panel-'+id} aria-selected={active===id} tabIndex={active===id?0:-1} ref={element=>{tabRefs.current[index]=element;}} onClick={()=>chooseTab(id)} onKeyDown={event=>navigateTabs(event,index)}>{text}</button>)}
    </div>
    <h2 id="booking-title">Plan with us</h2>
    <p className="booking-intro">A few details. We’ll reply on WhatsApp.</p>
    {tabs.map(([id])=><div key={id} id={'quick-panel-'+id} role="tabpanel" aria-labelledby={'quick-tab-'+id} hidden={active!==id}>
      <form className="quick-booking" data-purpose={id} onSubmit={submit}>
        <div className="booking-fields">
          {id==='event' ? <>{select('eventType','Event type',eventTypes,true)}{input('eventDate','Event date','date',{required:true})}{input('eventGuests','Guests','number')}</> : id==='room' ? <>{input('checkIn','Check-in','date',{required:true})}{input('checkOut','Check-out','date',{required:true,min:nextDay})}{select('roomGuests','Guests',guestOptions)}{select('room','Room',['Help me choose',...rooms])}</> : <>{input('tableDate','Date','date',{required:true})}{input('time','Time','time')}{select('tableGuests','Guests',guestOptions,true)}</>}
        </div>
        {error&&<p className="form-error" role="alert">{error}</p>}
        <button className="button gold" type="submit">Continue on WhatsApp</button>
        <p className="booking-note">We’ll confirm availability and rates with you.</p>
        {whatsapp&&<p className="booking-fallback" role="status">Your message is ready. <a href={whatsapp} target="_blank" rel="noopener noreferrer">Open WhatsApp</a> if it hasn’t opened.</p>}
      </form>
    </div>)}
  </aside>;
}

export default function HomeHero() {
  return <>
    <section className="hero hero-centered">
      <img src="/assets/images/pool-sunset.jpg" alt="Sunset reflected in the swimming pool at Jubilee" fetchPriority="high" width="1200" height="900"/>
      <div className="hero-shade"/>
      <div className="container centered-hero-content">
        <p className="eyebrow">Effurun · Delta State · Nigeria</p>
        <h1>A place to gather,<br/>to celebrate and to <em>rest.</em></h1>
        <p className="hero-sub">For the occasions that bring us together.<br/>And the quiet moments in between.</p>
        <div className="button-row"><a className="button gold" href="/events#enquiry">Plan an Event</a><a className="button outline" href="/rooms">Explore our rooms</a></div>
      </div>
    </section>
    <section className="booking-dock" aria-label="Direct enquiries">
      <div className="container dock-layout">
        <div className="dock-intro"><SectionLabel number="00">Your visit, thoughtfully planned</SectionLabel><h2>Gather. Dine. Stay.<br/>Let’s bring it together.</h2><p>Owned and managed by the Catholic Diocese of Warri.</p><p>Speak directly with the people at Jubilee, from the first question to the day you arrive.</p></div>
        <BookingCard/>
      </div>
    </section>
  </>;
}
