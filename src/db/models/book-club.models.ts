import { BookClubMembershipRequest } from './membership-request.models';

/** ENUMS */

// Book club role enum
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  READER = 'READER'
}

// Book club publicity enum
export enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/** SUBDOCUMENTS */

// BookClubMember subdocument
export interface BookClubMember {
  userEmail: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

/** DOCUMENTS */

// MongoDB BookClub document
export interface BookClubDoc {
  name: string;
  slug?: string;
  description: string;
  image: string;
  publicity: Publicity;
  members?: BookClubMember[];
  membershipRequests?: BookClubMembershipRequest[];
  disbanded?: Date;
}

/** PROJECTIONS */

// MongoDB projection for Book Club Members
export interface BookClubMemberProjection {
  preferredName: string;
  email: string;
  role: Role;
  joined: Date;
}

// MongoDB projection for only publicity
export interface PublicityProjection {
  publicity: Publicity;
}

// MongoDB projection for leaving out members and membership requests
export const rawBookClubProjection = {
  _id: 0,
  name: 1,
  slug: 1,
  description: 1,
  image: 1,
  publicity: 1,
  disbanded: 1
};

// MongoDB projection for only members.role; Used for pulling a single member's role
export interface MemberRoleProjection {
  role: Role[];
}

// Typeguard for MemberRoleProjection
export const isMemberRoleProjection = (
  obj: any
): obj is MemberRoleProjection => {
  return 'role' in obj;
};
