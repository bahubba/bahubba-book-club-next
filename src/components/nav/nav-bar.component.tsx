import Image from 'next/image';
import Link from 'next/link';
import {
  Navbar as NUINavBar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/navbar';

import AuthButton from '@/components/buttons/auth.button';
import ProfileLink from '@/components/nav/links/profile.link';
import props from '@/util/properties';
import UserAvatar from '@/components/avatars/user.avatar';

/** The navigation bar for the application, sticking to the top of the screen */
const NavBar = () => {
  return (
    <NUINavBar
      maxWidth="full"
      isBordered
      className="bg-primary text-secondary"
    >
      <Link href="/">
        <NavbarBrand>
          <Image
            src="/favicon.ico"
            alt="A pixelated, abstract image suggesting a lion head made out of bookshelves and books"
            height="30"
            width="30"
          />
          <h1 className="ps-2 text-3xl font-bold">{ props.APP.NAME }</h1>
        </NavbarBrand>
      </Link>
      <NavbarContent justify="end">
        <NavbarItem className="text-gray-300">
          <AuthButton/>
        </NavbarItem>
        <NavbarItem>
          <UserAvatar/>
        </NavbarItem>
      </NavbarContent>
    </NUINavBar>
  );
};

export default NavBar;
