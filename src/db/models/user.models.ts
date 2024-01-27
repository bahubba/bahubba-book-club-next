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
  clubID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

// MongoDB User document
export interface UserDoc {
  _id?: string;
  email: string;
  preferredName: string;
  providerProfiles: {
    [key: string]: ProviderProfile
  };
  memberships?: BookClubMembership[];
}