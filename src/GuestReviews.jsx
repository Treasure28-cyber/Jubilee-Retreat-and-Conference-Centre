import React from 'react';
import {centreContact, googleRating, guestReviews} from './content.js';
import SectionLabel from './SectionLabel.jsx';

export default function GuestReviews() {
  return <section className="section guest-reviews" aria-labelledby="reviews-title">
    <div className="container">
      <SectionLabel number="04">Guest reviews</SectionLabel>
      <div className="reviews-heading"><h2 id="reviews-title">4.1 on Google,<br/>from 989 reviews.</h2><a className="button outline-dark" href={centreContact.googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read our Google reviews</a></div>
      {guestReviews.length ? <div className="three-grid review-cards">{guestReviews.map(({text,stars,name})=><blockquote key={name+text}><p className="review-score">{stars} / 5</p><p>{text}</p><cite>{name}</cite></blockquote>)}</div> : <div className="google-rating"><strong>{googleRating.score}</strong><div><span className="rating-scale">out of 5 on Google</span><p>{googleRating.count} Google reviews</p></div></div>}
    </div>
  </section>;
}

export function TrustStrip() {
  return <section className="trust-strip jubilee-trust" aria-label="At a glance"><div className="container">
    <a href={centreContact.googleReviewsUrl} target="_blank" rel="noopener noreferrer"><strong>4.1 on Google</strong><span>989 reviews</span></a>
    <div><strong>Owned and managed by</strong><span>the Catholic Diocese of Warri</span></div>
    <div><strong>Swimming pool</strong></div>
    <div><strong>Large car park</strong></div>
  </div></section>;
}
