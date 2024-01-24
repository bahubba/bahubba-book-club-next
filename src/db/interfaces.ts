export interface UserDoc {
  email: string;
  givenName: string;
  surname: string;
  imageURL: string;
  memberships?: BookClubMembership[];
}

export interface BookClubDoc {
  name: String;
  description: String;
  image: String;
  members?: BookClubMember[];
}

export type Role = 'OWNER' | 'ADMIN' | 'READER' | 'PARTICIPANT' | 'OBSERVER';

export interface BookClubMembership {
  clubID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}

export interface BookClubMember {
  userID: string;
  joined: Date;
  departed?: Date;
  role: Role;
}