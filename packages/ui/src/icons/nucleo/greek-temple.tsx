import { SVGProps } from 'react';

export function GreekTemple(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="2.75"
          x2="15.25"
          y1="15.25"
          y2="15.25"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="7.25"
          x2="7.25"
          y1="15.25"
          y2="9.75"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="3.75"
          x2="3.75"
          y1="15.25"
          y2="9.75"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="10.75"
          x2="10.75"
          y1="15.25"
          y2="9.75"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="14.25"
          x2="14.25"
          y1="15.25"
          y2="9.75"
        />
        <path
          d="M9,7.25h5.25c.552,0,1-.448,1-1v-.414c0-.362-.196-.696-.511-.873l-5.25-2.94c-.304-.17-.674-.17-.977,0L3.261,4.964c-.316,.177-.511,.511-.511,.873v.414c0,.552,.448,1,1,1h5.25Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="4.75" fill="currentColor" r="1" stroke="none" />
      </g>
    </svg>
  );
}
