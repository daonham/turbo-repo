import { SVGProps } from 'react';

export function CursorRays(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <path
          d="M8.095,7.778l7.314,2.51c.222,.076,.226,.388,.007,.47l-3.279,1.233c-.067,.025-.121,.079-.146,.146l-1.233,3.279c-.083,.219-.394,.215-.47-.007l-2.51-7.314c-.068-.197,.121-.385,.318-.318Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="12.031" x2="16.243" y1="12.031" y2="16.243" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="7.75" x2="7.75" y1="1.75" y2="3.75" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="11.993" x2="10.578" y1="3.507" y2="4.922" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="3.507" x2="4.922" y1="11.993" y2="10.578" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="1.75" x2="3.75" y1="7.75" y2="7.75" />
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="3.507" x2="4.922" y1="3.507" y2="4.922" />
      </g>
    </svg>
  );
}
