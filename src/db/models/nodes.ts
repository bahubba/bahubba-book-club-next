import { Node } from 'neo4j-driver';

/** ENUMS */

// Book club publicity enum
export enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
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

// Combined user and provider profile properties
export interface UserAndProviderProfile {
  user: UserProperties | null;
  profile: ProviderProfileProperties | null;
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
