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
  provider: string;
  userId: string | undefined;
  providerAccountId: string;
  name: string;
  sub: string | undefined;
  image: string | null | undefined;
  isActive: boolean;
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

// Book node properties
export interface BookProperties {
  googleBooksID: string | null,
  title: string,
  authors: string[],
  description?: string,
  thumbnail?: string,
  identifiers?: Array<{identifier?: string; type?: string}>
  isActive: boolean;
}

// Membership request node properties
export interface MembershipRequestProperties {
  status: MembershipRequestStatus;
  requested: Date | string;
  requestMessage: string;
  reviewed?: Date | string;
  reviewMessage?: string;
}

// Book pick properties
export interface PickProperties {
  pickedOn: Date | string;
  targetCompletion?: Date | string;
  completed?: Date | string;
  isActive: boolean;
}

// Discussion node properties
export interface DiscussionProperties {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  created: Date | string;
  lastUpdated: Date | string;
  closed?: Date | string;
}

// Reply node properties
export interface ReplyProperties {
  id: string;
  content: string;
  isActive: boolean;
  created: Date | string;
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

// Discussion reply with user
export interface ReplyWithUser extends ReplyProperties {
  user: UserProperties;
}

// Discussion with latest 2 replies
export interface DiscussionPreview extends DiscussionProperties {
  replies: ReplyWithUser[];
}

// Replies alongside a total number of replies for a discussion
export interface RepliesAndTotalPage {
  replies: ReplyWithUser[];
  total: number;
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

// Discussion node
export interface DiscussionNode extends Node {
  properties: DiscussionProperties;
}

// Reply Node
export interface ReplyNode extends Node {
  properties: ReplyProperties;
}
