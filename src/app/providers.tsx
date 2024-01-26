'use client';

import { NextUIProvider } from '@nextui-org/react';

/** Next-UI theme provider */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      { children }
    </NextUIProvider>
  );
}