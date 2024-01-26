import Image from 'next/image';
import Link from 'next/link';
import { Navbar as NUINavBar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';

import props from '@/util/properties';

/** The navigation bar for the application, sticking to the top of the screen */
const NavBar = () => {
  return (
    <NUINavBar className="bg-green-700 text-yellow-500">
      <Link href="/">
        <NavbarBrand>
          <Image
            src="/favicon.ico"
            alt="A pixelated image of books making the image of a lion"
            height="30"
            width="30"
          />
          <h1 className="ps-2 text-3xl font-bold">{ props.APP.NAME }</h1>
        </NavbarBrand>
      </Link>
      <NavbarContent>
        <Link href="/">
          <NavbarItem className="text-gray-300">
            Logout
          </NavbarItem>
        </Link>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/profile" className="italic">
            Welcome, user
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NUINavBar>
  );
};

export default NavBar;