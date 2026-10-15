import React, {useEffect, useState} from 'react';
import {rooms} from './components.jsx';

function dateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function BookingCard() {
  const [purpose,setPurpose]=useState('event');
  const [eventDate,setEventDate]=useState('');
  const [eventType,setEventType]=useState('Help me choose');
  const [eventGuests,setEventGuests]=useState('');
  const [extras,setExtras]=useState('Venue only');
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
    if(purpose==='stay'&&(!checkIn||!checkOut||checkIn<today||checkOut<=checkIn)){setError('Choose a check-in date from today and a check-out date after your arrival.');return;}
    if(purpose==='event'&&(!eventDate||eventDate<today||!Number.isInteger(Number(eventGuests))||Number(eventGuests)<1)){setError('Choose an upcoming date and tell us how many guests you expect.');return;}
    setError('');
    const format=value=>new Intl.DateTimeFormat('en-NG',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));
    const message=purpose==='event'
      ? `Hello Jubilee, I’d like to plan an event.\n\nEvent: ${eventType}\nPreferred date: ${format(eventDate)}\nExpected guests: ${eventGuests}\nAlso needed: ${extras}\n\nPlease help me choose a suitable hall and share availability and a quote. Thank you.`
      : `Hello Jubilee, I’d like to book a stay.\n\nCheck-in: ${format(checkIn)}\nCheck-out: ${format(checkOut)}\nGuests: ${guests}\nRoom preference: ${room}\n\nPlease confirm availability and current rates. Thank you.`;
    const url='https://wa.me/2348103150133?text='+encodeURIComponent(message);
    setWhatsapp(url);
    window.open(url,'_blank','noopener,noreferrer');
  }
  return <aside className="booking-card" aria-labelledby="booking-title" id="plan-your-visit">
    <p className="eyebrow">Direct bookings</p>
    <h2 id="booking-title">{purpose==='event'?'Book your event.':'Make yourself at home.'}</h2>
    <p className="booking-intro">{purpose==='event'?'A celebration, a conference, a retreat. Let’s find the right space for you.':'A quiet weekend or a room after the celebration. Tell us when you’re coming.'}</p>
    <div className="booking-purpose" role="group" aria-label="What would you like to book?">
      {[['event','Book your event'],['stay','Book a stay']].map(([value,text])=><button key={value} type="button" aria-pressed={purpose===value} onClick={()=>{setPurpose(value);setError('');setWhatsapp('');}}>{text}</button>)}
    </div>
    <form onSubmit={submit} className="quick-booking">
      <div className="booking-fields">
        {purpose==='event'?<>
          <label htmlFor="visit-event-date">Preferred date<input id="visit-event-date" type="date" required min={today} value={eventDate} onChange={e=>{setEventDate(e.target.value);setWhatsapp('');}}/></label>
          <label htmlFor="visit-event-guests">Expected guests<input id="visit-event-guests" type="number" required min="1" max="10000" inputMode="numeric" placeholder="Guest count" value={eventGuests} onChange={e=>{setEventGuests(e.target.value);setWhatsapp('');}}/></label>
          <label htmlFor="visit-event-type">Your occasion<select id="visit-event-type" value={eventType} onChange={e=>{setEventType(e.target.value);setWhatsapp('');}}>{['Help me choose','Wedding or reception','Conference or meeting','Retreat','Birthday or celebration','Other occasion'].map(x=><option key={x}>{x}</option>)}</select></label>
          <label htmlFor="visit-event-extras">Also needed<select id="visit-event-extras" value={extras} onChange={e=>{setExtras(e.target.value);setWhatsapp('');}}>{['Venue only','Catering','Rooms for guests','Catering and rooms','Let’s discuss'].map(x=><option key={x}>{x}</option>)}</select></label>
        </>:<>
        <label htmlFor="stay-check-in">Check-in<input id="stay-check-in" name="checkIn" type="date" required min={today} value={checkIn} onChange={e=>{setCheckIn(e.target.value);setWhatsapp('');}}/></label>
        <label htmlFor="stay-check-out">Check-out<input id="stay-check-out" name="checkOut" type="date" required min={nextDay} value={checkOut} onChange={e=>{setCheckOut(e.target.value);setWhatsapp('');}}/></label>
        <label htmlFor="stay-guests">Guests<select id="stay-guests" name="guests" value={guests} onChange={e=>{setGuests(e.target.value);setWhatsapp('');}}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}<option value="7 or more">7 or more guests</option></select></label>
        <label htmlFor="stay-room">Room preference<select id="stay-room" name="room" value={room} onChange={e=>{setRoom(e.target.value);setWhatsapp('');}}><option>Help me choose</option>{rooms.map(name=><option key={name}>{name}</option>)}</select></label>
        </>}
      </div>
      {error&&<p className="form-error" role="alert">{error}</p>}
      <button className="button gold" type="submit">{purpose==='event'?'Let’s plan on WhatsApp':'Ask about your stay'}</button>
      <p className="booking-note">Chat directly with our team on WhatsApp. No payment required.</p>
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
