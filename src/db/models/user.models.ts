// Provider subdocument
import { Role } from '@/db/models/book-club.models';

export interface ProviderProfile {
  userId: string | undefined;
  providerAccountId: string;
  name: string;
  sub: string | undefined;
  image: string | null | undefined;
}

// BookClubMembership subdocument
export interface BookClubMembership {
  clubSlug: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

// MongoDB User document
export interface UserDoc {
  email: string;
  preferredName: string;
  providerProfiles: {
    [key: string]: ProviderProfile;
  };
  memberships: BookClubMembership[];
  joined: Date;
  departed?: Date;
}

// MongoDB projection for the User document withuot memberships
export const noMembershipsUserProjection = {
  _id: 0,
  email: 1,
  preferredName: 1,
  providerProfiles: 1,
  joined: 1,
  departed: 1
};

// MongoDB projection for User document without memberships or provider profiles
export const rawUserProjection = {
  _id: 0,
  email: 1,
  preferredName: 1,
  joined: 1,
  departed: 1
};
