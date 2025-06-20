'use client';

import { ComponentType, SVGProps } from 'react';
import { LucideIcon } from 'lucide-react';

// loaders
export * from './loading-circle';
export * from './loading-dots';
export * from './loading-spinner';

export * from './sort-order';

// brand logos
export * from './facebook';
export * from './github';
export * from './google';
export * from './linkedin';

export type Icon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
