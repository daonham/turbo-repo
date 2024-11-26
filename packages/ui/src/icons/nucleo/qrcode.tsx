import { SVGProps } from 'react';

export function QRCode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <rect
          height="5"
          width="5"
          fill="none"
          rx="1"
          ry="1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x="2.75"
          y="2.75"
        />
        <rect
          height="5"
          width="5"
          fill="none"
          rx="1"
          ry="1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x="10.25"
          y="2.75"
        />
        <rect
          height="5"
          width="5"
          fill="none"
          rx="1"
          ry="1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x="2.75"
          y="10.25"
        />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="4.5" y="4.5" />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="12" y="4.5" />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="4.5" y="12" />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="14.5" y="14.5" />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="13" y="13" />
        <rect height="1.5" width="1.5" fill="currentColor" stroke="none" x="14.5" y="11.5" />
        <rect height="1.5" width="2" fill="currentColor" stroke="none" x="11" y="14.5" />
        <rect height="3" width="1.5" fill="currentColor" stroke="none" x="9.5" y="11.5" />
        <rect height="1.5" width="3.5" fill="currentColor" stroke="none" x="11" y="10" />
      </g>
    </svg>
  );
}
