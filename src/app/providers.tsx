'use client';

import { NextUIProvider } from '@nextui-org/react';

/** Next-UI theme provider */
export const Providers = ({ children }: { children: React.ReactNode }) => (
  <NextUIProvider>{children}</NextUIProvider>
);
