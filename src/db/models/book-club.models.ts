// Book club role enum
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  READER = 'READER',
  PARTICIPANT = 'PARTICIPANT',
  OBSERVER = 'OBSERVER'
}

// Book club publicity enum
export enum Publicity {
  PUBLIC = 'PUBLIC',
  OBSERVABLE = 'OBSERVABLE',
  PRIVATE = 'PRIVATE'
}

// BookClubMember subdocument
export interface BookClubMember {
  userID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

// MongoDB BookClub document
export interface BookClubDoc {
  _id?: string;
  name: string;
  description: string;
  image: string;
  publicity: Publicity;
  members?: BookClubMember[];
  disbanded?: Date;
}