import React from 'react';
import SectionLabel from './SectionLabel.jsx';

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
        <aside className="booking-card visit-cta"><h2>Plan your visit</h2><p>Tell us what you have in mind. Our team will help with the details.</p><div className="visit-actions"><a className="button gold" href="/contact?type=event#enquiry-form">Plan an Event</a><a className="button outline-dark" href="/contact?type=room#enquiry-form">Book a Room Now</a><a className="text-link" href="/contact?type=table#enquiry-form">Reserve a Table</a></div></aside>
      </div>
    </section>
  </>;
}
