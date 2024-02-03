/** ENUMS */

export enum BookClubMembershipRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

/** SUBDOCUMENTS */

export interface BookClubMembershipRequest {
  userEmail: string;
  message: string;
  requested: Date;
  status: BookClubMembershipRequestStatus;
}
