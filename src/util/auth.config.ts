import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { addUser, findUserByEmail } from '@/db/repositories/user.repository';
import UserModel from '@/db/models/user.model';

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
      const userDoc = await findUserByEmail(email);

      // If the user doesn't exist, add them to the database
      if (!userDoc) {
        await addUser({
          email,
          preferredName: user.name ?? profile.name ?? 'Anonymous User',
          providerProfiles: new Map([
            [ account.provider, {
              userId: account.userId ?? user.id,
              providerAccountId: account.providerAccountId,
              name: user.name ?? profile.name ?? 'Anonymous User',
              sub: profile.sub,
              image: profile.image ?? user.image
            } ]
          ])
        });
      } else {
        // If the user exists, update their profile with the current provider info
        userDoc.providerProfiles.set(account.provider, {
          userId: account.userId ?? user.id,
          providerAccountId: account.providerAccountId,
          name: user.name ?? profile.name ?? 'Anonymous User',
          sub: profile.sub,
          image: profile.image ?? user.image
        });

        await UserModel.updateOne({ email }, userDoc);
      }

      return true;
    }
  }
};
