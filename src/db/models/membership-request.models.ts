/** ENUMS */

export enum BookClubMembershipRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/** SUBDOCUMENTS */

export interface BookClubMembershipRequest {
  userEmail: string;
  message: string;
  requested: Date;
  status: BookClubMembershipRequestStatus;
}
