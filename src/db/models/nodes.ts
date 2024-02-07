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
  joined: Date;
  departed?: Date;
}

// Book club node properties
export interface BookClubProperties {
  name: string;
  slug?: string;
  description: string;
  image: string;
  publicity: Publicity;
  disbanded?: Date;
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
