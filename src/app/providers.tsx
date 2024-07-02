'use client';

import { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';

/**
 * Next-UI theme provider
 *
 * @param {Readonly<{ children: ReactNode }>} props Component props
 * @param {ReactNode} props.children Component children
 * @constructor
 */
export const Providers = ({ children }: { children: ReactNode }) => (
  <NextUIProvider>{children}</NextUIProvider>
);
