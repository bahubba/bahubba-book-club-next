import { Node } from 'neo4j-driver';

/** ENUMS */

// Book club publicity enum
export enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

// Book club role enum
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  READER = 'READER'
}

// Membership request status enum
export enum MembershipRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/** PROPERTIES */

// Provider profile node properties
export interface ProviderProfileProperties {
  userId: string | undefined;
  providerAccountId: string;
  name: string;
  sub: string | undefined;
  image: string | null | undefined;
}

// User node properties
export interface UserProperties {
  email: string;
  preferredName: string;
  preferredImage?: string;
  joined: Date | string;
  isActive: boolean;
  departed?: Date | string;
}

// Book club node properties
export interface BookClubProperties {
  name: string;
  slug?: string;
  description: string;
  image: string;
  publicity: Publicity;
  isActive: boolean;
  created: Date | string;
  disbanded?: Date | string;
}

// Membership node properties
export interface MembershipProperties {
  role: Role;
  joined: Date | string;
  isActive: boolean;
  departed?: Date | string;
}

// Membership request node properties
export interface MembershipRequestProperties {
  status: MembershipRequestStatus;
  requested: Date | string;
  requestMessage: string;
  reviewed?: Date | string;
  reviewMessage?: string;
}

/** TUPLES/COMBOS OF NODE PROPERTIES */

// Combined user and provider profile properties
export interface UserAndProviderProfile {
  user: UserProperties | null;
  profile: ProviderProfileProperties | null;
}

// Combined user and book club membership properties
export interface UserAndMembership {
  user: UserProperties;
  membership: MembershipProperties;
}

// Combined user and book club membership request properties
export interface UserAndMembershipRequest {
  user: UserProperties;
  request: MembershipRequestProperties;
}

/** NODES */

// OAuth2 provider profile node
export interface ProviderProfileNode extends Node {
  properties: ProviderProfileProperties;
}

// User node
export interface UserNode extends Node {
  properties: UserProperties;
}

// Book club node
export interface BookClubNode extends Node {
  properties: BookClubProperties;
}

// Membership node
export interface MembershipNode extends Node {
  properties: MembershipProperties;
}

// Membership request node
export interface MembershipRequestNode extends Node {
  properties: MembershipRequestProperties;
}
