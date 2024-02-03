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

export enum BookClubMembershipRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

/** SUBDOCUMENTS */

// BookClubMember subdocument
export interface BookClubMember {
  userEmail: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

export interface BookClubMembershipRequest {
  userEmail: string;
  requested: Date;
  status: BookClubMembershipRequestStatus;
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
