import { SVGProps } from 'react';

export function Crosshairs3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <circle cx="9" cy="9" fill="none" r="7.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="9" x2="9" y1="7" y2="4.75" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="11" x2="13.25" y1="9" y2="9" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="9" x2="9" y1="11" y2="13.25" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="7" x2="4.75" y1="9" y2="9" />
      </g>
    </svg>
  );
}
