import { SVGProps } from 'react';

export function EarthPosition(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <path
          d="M5.771,9.887c-.044-.065-.855-1.323-.24-2.575,.067-.137,.484-.949,1.344-1.188,1.273-.353,2.203,.919,2.805,.535,.243-.155,.275-.478,.254-.873"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M5.771,9.887c1.589-.439,2.611-.224,3.292,.175,.939,.55,1.006,1.318,1.812,1.469,1.163,.218,1.844-1.227,2.875-1.031,.479,.091,1.062,.542,1.568,2.057"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M8.601,16.23c.148-.579,.234-1.343-.163-1.938-.423-.635-1.021-.517-1.422-1.182-.418-.694,.014-1.185-.297-2.047-.292-.809-.961-1.174-1.463-1.541-.836-.611-1.874-1.711-2.688-3.859"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M15.792,6.459c.296,.791,.458,1.647,.458,2.541,0,4.004-3.246,7.25-7.25,7.25S1.75,13.004,1.75,9C1.75,5.042,4.922,1.825,8.862,1.751"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle cx="13.25" cy="2.75" fill="none" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="13.25"
          x2="13.25"
          y1="4.75"
          y2="7.25"
        />
      </g>
    </svg>
  );
}
