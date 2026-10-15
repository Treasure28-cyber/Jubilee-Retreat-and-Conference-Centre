import React, {useEffect, useState} from 'react';
import {rooms} from './components.jsx';

function dateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function BookingCard() {
  const [today,setToday]=useState('');
  const [checkIn,setCheckIn]=useState('');
  const [checkOut,setCheckOut]=useState('');
  const [guests,setGuests]=useState('2');
  const [room,setRoom]=useState('Help me choose');
  const [error,setError]=useState('');
  const [whatsapp,setWhatsapp]=useState('');
  useEffect(()=>setToday(dateString(new Date())),[]);
  const nextDay=checkIn?dateString(new Date(new Date(checkIn+'T12:00:00').getTime()+86400000)):today;
  function submit(event) {
    event.preventDefault();
    if(!checkIn||!checkOut||checkIn<today||checkOut<=checkIn){setError('Choose a check-in date from today and a check-out date after your arrival.');return;}
    setError('');
    const format=value=>new Intl.DateTimeFormat('en-NG',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));
    const message=`Hello Jubilee, I’d like to enquire about a stay.\n\nCheck-in: ${format(checkIn)}\nCheck-out: ${format(checkOut)}\nGuests: ${guests}\nRoom preference: ${room}\n\nPlease confirm availability and current rates. Thank you.`;
    const url='https://wa.me/2348103150133?text='+encodeURIComponent(message);
    setWhatsapp(url);
    window.open(url,'_blank','noopener,noreferrer');
  }
  return <aside className="booking-card" aria-labelledby="booking-title" id="plan-your-stay">
    <p className="eyebrow">Direct bookings</p>
    <h2 id="booking-title">Plan your stay.</h2>
    <p className="booking-intro">A few details. A personal welcome.</p>
    <form onSubmit={submit} className="quick-booking">
      <div className="booking-fields">
        <label htmlFor="stay-check-in">Check-in<input id="stay-check-in" name="checkIn" type="date" required min={today} value={checkIn} onChange={e=>{setCheckIn(e.target.value);setWhatsapp('');}}/></label>
        <label htmlFor="stay-check-out">Check-out<input id="stay-check-out" name="checkOut" type="date" required min={nextDay} value={checkOut} onChange={e=>{setCheckOut(e.target.value);setWhatsapp('');}}/></label>
        <label htmlFor="stay-guests">Guests<select id="stay-guests" name="guests" value={guests} onChange={e=>{setGuests(e.target.value);setWhatsapp('');}}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}<option value="7 or more">7 or more guests</option></select></label>
        <label htmlFor="stay-room">Room preference<select id="stay-room" name="room" value={room} onChange={e=>{setRoom(e.target.value);setWhatsapp('');}}><option>Help me choose</option>{rooms.map(name=><option key={name}>{name}</option>)}</select></label>
      </div>
      {error&&<p className="form-error" role="alert">{error}</p>}
      <button className="button gold" type="submit">Enquire on WhatsApp</button>
      <p className="booking-note">We’ll confirm availability &amp; rates with you.</p>
      {whatsapp&&<p className="booking-fallback" role="status">Your message is ready. <a href={whatsapp} target="_blank" rel="noopener noreferrer">Continue to WhatsApp</a> if it hasn’t opened.</p>}
    </form>
  </aside>;
}

export default function HomeHero() {
  return <section className="hero hero-with-booking">
    <img src="/assets/images/pool-sunset.jpg" alt="Sunset reflected in the swimming pool at Jubilee" fetchPriority="high" width="1200" height="900"/>
    <div className="hero-shade"/>
    <div className="container hero-layout">
      <div className="hero-copy"><p className="eyebrow">Effurun · Delta State · Nigeria</p><h1>A place to gather,<br/>to celebrate<br/>and to <em>rest.</em></h1><p>For the occasions that bring us together.<br/>And the quiet moments in between.</p><div className="button-row"><a className="button gold" href="/events#enquiry">Plan an Event</a><a className="button outline" href="/rooms">Explore our rooms</a></div></div>
      <BookingCard/>
    </div>
    <div className="hero-bottom container"><span>RETREATS. CELEBRATIONS. CONNECTIONS.</span><span className="hero-caption">A little room to slow down.</span></div>
  </section>;
}
