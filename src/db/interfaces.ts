// MongoDB User document
export interface UserDoc {
  email: string;
  givenName: string;
  surname: string;
  imageURL: string;
  memberships?: BookClubMembership[];
}

// MongoDB BookClub document
export interface BookClubDoc {
  name: String;
  description: String;
  image: String;
  members?: BookClubMember[];
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