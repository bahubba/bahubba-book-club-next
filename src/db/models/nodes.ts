import { Node } from 'neo4j-driver';

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

/** NODES */

// OAuth2 provider profile node
export interface ProviderProfileNode extends Node {
  properties: ProviderProfileProperties;
}

// User node
export interface UserNode extends Node {
  properties: UserProperties;
}
