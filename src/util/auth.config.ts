import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import {
  addProviderProfile,
  addUser,
  findUserAndProviderProfile,
  updateProviderProfile,
  findUser
} from '@/db/repositories/user.repository';
import {
  ProviderProfileProperties,
  UserAndProviderProfile
} from '@/db/models/nodes';

import props from '@/util/properties';

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
    async signIn({ user: authUser, account, profile }) {
      // Can't sign in without an email address
      if (!profile?.email || !account) {
        return false;
      }

      // Pull the email from the profile
      const { email } = profile;

      // Check if the user exists in the database
      const user = await findUser(email);

      // Format the provider
      const provider = account.provider.toUpperCase();

      // Collect the provider profile properties
      const providerProfile: ProviderProfileProperties = {
        provider,
        userId: account.userId ?? authUser.id,
        providerAccountId: account.providerAccountId,
        name: authUser.name ?? profile.name ?? 'Anonymous User',
        sub: profile.sub,
        image: profile.image ?? authUser.image,
        isActive: true
      };

      // TODO - Catch error
      // Check if the user exists in Neo4j
      const neo4jUser: UserAndProviderProfile =
        await findUserAndProviderProfile(email, provider, account.userId ?? authUser.id);

      // Update user info in Neo4j if necessary
      if (!neo4jUser.user) {
        // Create a new user with the provider profile
        // TODO - Catch error
        await addUser(
          {
            email,
            preferredName: authUser.name ?? profile.name ?? 'Anonymous User',
            preferredImage: profile.image ?? authUser.image ?? undefined,
            joined: new Date().toISOString(),
            isActive: true
          },
          providerProfile
        );
      } else if (!neo4jUser.profile) {
        // Create a new provider profile for the user
        await addProviderProfile(email, providerProfile);
      } else {
        // Update the provider profile for the user
        await updateProviderProfile(email, providerProfile);
      }

      return true;
    }
  }
};
