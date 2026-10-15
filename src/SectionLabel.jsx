import React from 'react';

export default function SectionLabel({number,children}) {
  return <p className="section-label"><span className="section-label-number">{number}</span><span className="section-label-rule" aria-hidden="true"/><span>{children}</span></p>;
}
