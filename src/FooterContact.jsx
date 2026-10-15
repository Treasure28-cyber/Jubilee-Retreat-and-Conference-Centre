import React from 'react';
import {centreContact} from './content.js';

export default function FooterContact() {
  return <>
    {centreContact.email&&<a href={'mailto:'+centreContact.email}>{centreContact.email}</a>}
    {centreContact.secondPhone&&<a href={'tel:'+centreContact.secondPhone.replace(/[^+\d]/g,'')}>{centreContact.secondPhone}</a>}
  </>;
}
