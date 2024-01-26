import type { Metadata } from 'next';
import { Roboto_Slab } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import NavBar from '@/components/nav/nav-bar.component';
import props from '@/util/properties';

// Load the Roboto Slab font for use throughout the application
const robotoSlab = Roboto_Slab({ weight: '400', subsets: [ 'latin' ] });

// Metadata for the application
export const metadata: Metadata = {
  title: props.APP.NAME,
  description: 'Create, manage, join, and participate in book clubs.',
};

/** The root layout for the application */
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
    <body className={ robotoSlab.className }>
    <Providers>
      <NavBar/>
      { children }
    </Providers>
    </body>
    </html>
  );
};

export default RootLayout;