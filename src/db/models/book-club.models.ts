// Book club role enum
export type Role = 'OWNER' | 'ADMIN' | 'READER' | 'PARTICIPANT' | 'OBSERVER';

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
  members?: BookClubMember[];
}