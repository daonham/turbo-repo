'use client';

import { LucideIcon } from 'lucide-react';
import { ComponentType, SVGProps } from 'react';

// loaders
export * from './loading-circle';
export * from './loading-dots';
export * from './loading-spinner';

// brand logos
export * from './facebook';
export * from './github';
export * from './google';
export * from './linkedin';

export type Icon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
