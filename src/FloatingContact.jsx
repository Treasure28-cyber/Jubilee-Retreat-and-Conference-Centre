import React,{useEffect,useState} from 'react';

export default function FloatingContact(){
  const [hidden,setHidden]=useState(false);
  useEffect(()=>{
    if(!('IntersectionObserver' in window))return;
    const visible=new Set();
    const observer=new window.IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target):visible.delete(entry.target));
      setHidden(visible.size>0);
    },{threshold:0});
    // These sections already offer a direct enquiry, so keep the content clear.
    document.querySelectorAll('.booking-card, footer').forEach(element=>observer.observe(element));
    return ()=>observer.disconnect();
  },[]);
  return <a className="whatsapp" hidden={hidden} href="https://wa.me/2348103150133?text=Hello%20Jubilee%2C%20I%27d%20like%20to%20ask%20about%20an%20event%20or%20a%20stay." aria-label="Ask Jubilee about an event or a stay on WhatsApp">
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M27 15.5a11 11 0 0 1-16.4 9.6L5 27l1.8-5.6A11 11 0 1 1 27 15.5Z" stroke="currentColor" strokeWidth="1.8"/><path d="M12 9.7c-.7-.2-1.5 1-1.5 2 0 4 5.2 9.1 8.8 8.6 1.2-.2 2.3-1.4 1.8-2.2l-2.7-1.4-1.3 1.1c-1.9-.7-3.4-2.1-4-3.9l1-1.3-1.3-2.9Z" fill="currentColor"/></svg>
  </a>;
}
