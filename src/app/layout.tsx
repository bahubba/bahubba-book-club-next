import type { Metadata } from 'next';
import { Roboto_Slab } from 'next/font/google';
import './globals.css';

import { getServerSession } from 'next-auth';
import SessionProvider from '@/state/session-provider';
import { Providers } from '@/app/providers';
import AppBar from '@/components/nav/app-bar.navbar';
import props from '@/util/properties';

// Load the Roboto Slab font for use throughout the application
const robotoSlab = Roboto_Slab({ weight: '400', subsets: ['latin'] });

// Metadata for the application
export const metadata: Metadata = {
  title: props.APP.NAME as string,
  description: 'Create, manage, join, and participate in book clubs.'
};

/** The root layout for the application */
const RootLayout = async ({
  children
}: Readonly<{ children: React.ReactNode }>) => {
  // Get the server-side session
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={robotoSlab.className}>
        <Providers>
          <SessionProvider session={session}>
            <main className="flex flex-col h-screen">
              <AppBar />
              <div className="flex-1 bg-gray-100 max-h-fill-below-header">
                {children}
              </div>
            </main>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
