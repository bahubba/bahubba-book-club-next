import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';

import { getServerSession } from 'next-auth';
import SessionProvider from '@/state/session-provider';
import { Providers } from '@/app/providers';
import NavBar from '@/components/nav/nav-bar.component';
import props from '@/util/properties';
import ProtectedRoute from '@/components/nav/protected-route.component';

// Load the Roboto Slab font for use throughout the application
const robotoSlab = Roboto_Slab({ weight: '400', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
              <NavBar />
              <div className="pt-2 flex-1 bg-gray-100 max-h-fill-below-header">
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
