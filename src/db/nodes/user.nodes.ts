import { Integer, Node } from 'neo4j-driver';

// Properties for a User node
export interface UserNodeProps {
  email: string;
  preferredName: string;
  joined: string; // ISO 8601 date string
  departed?: string; // ISO 8601 date string
}

// Properties for a ProviderProfile node
export interface ProviderProfileNodeProps {
  userId: string | undefined;
  providerAccountId: string;
  name: string;
  sub: string | undefined;
  image: string | null | undefined;
}

// User Node
export interface UserNode extends Node<Integer, UserNodeProps, string> {}

// ProviderProfile Node
export interface ProviderProfileNode
  extends Node<Integer, ProviderProfileNodeProps, string> {}

// Tuple of User and ProviderProfile nodes
export interface UserNodeWithProviderProfile {
  user: UserNode | null;
  profile: ProviderProfileNode | null;
}
