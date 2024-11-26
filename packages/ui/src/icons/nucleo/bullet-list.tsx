import { SVGProps } from 'react';

export function BulletList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="8.25"
          x2="15.75"
          y1="11.25"
          y2="11.25"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="8.25"
          x2="15.75"
          y1="14.75"
          y2="14.75"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="8.25"
          x2="15.75"
          y1="4.25"
          y2="4.25"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="8.25"
          x2="15.75"
          y1="7.75"
          y2="7.75"
        />
        <circle cx="3.75" cy="4.25" fill="none" r="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle cx="3.75" cy="11.25" fill="none" r="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
