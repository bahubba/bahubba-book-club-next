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
