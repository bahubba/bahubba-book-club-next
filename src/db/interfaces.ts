import { Document } from 'mongoose';

// Provider profile info
export interface ProviderProfile {
  userId: string | undefined;
  providerAccountId: string;
  name: string;
  sub: string | undefined;
  image: string | null | undefined;
}

// User info
export interface User {
  email: string;
  preferredName: string;
  providerProfiles: Map<string, ProviderProfile>;
  memberships?: BookClubMembership[];
}

// MongoDB User document
export interface UserDoc extends User, Document {
}

// Book club info
export interface BookClub {
  name: String;
  description: String;
  image: String;
  members?: BookClubMember[];
}

// MongoDB BookClub document
export interface BookClubDoc extends BookClub, Document {
}

// Book club role enum
export type Role = 'OWNER' | 'ADMIN' | 'READER' | 'PARTICIPANT' | 'OBSERVER';

// MongoDB BookClubMembership subdocument
export interface BookClubMembership {
  clubID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

// MongoDB BookClubMember subdocument
export interface BookClubMember {
  userID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}
