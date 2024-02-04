import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import {
  addUser,
  findFullUserByEmail,
  updateUser
} from '@/db/repositories/user.repository';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.BBCM_GITHUB_ID as string,
      clientSecret: process.env.BBCM_GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.BBCM_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BBCM_GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Can't sign in without an email address
      if (!profile?.email || !account) {
        return false;
      }

      // Pull the email from the profile
      const { email } = profile;

      // Check if the user exists in the database
      const userDoc = await findFullUserByEmail(email);

      // If the user doesn't exist, add them to the database
      if (!userDoc) {
        await addUser({
          email,
          preferredName: user.name ?? profile.name ?? 'Anonymous User',
          providerProfiles: {
            [account.provider]: {
              userId: account.userId ?? user.id,
              providerAccountId: account.providerAccountId,
              name: user.name ?? profile.name ?? 'Anonymous User',
              sub: profile.sub,
              image: profile.image ?? user.image
            }
          },
          memberships: [],
          joined: new Date()
        });
      } else {
        // If the user exists, update their profile with the current provider info
        userDoc.providerProfiles[account.provider] = {
          userId: account.userId ?? user.id,
          providerAccountId: account.providerAccountId,
          name: user.name ?? profile.name ?? 'Anonymous User',
          sub: profile.sub,
          image: profile.image ?? user.image
        };

        // Update the user in MongoDB
        await updateUser(userDoc);
      }

      return true;
    }
  }
};
