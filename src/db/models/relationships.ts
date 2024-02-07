import { Integer, Relationship } from 'neo4j-driver';

/** ENUMS */

// Book club role enum
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  READER = 'READER'
}

/** PROPERTIES */

// Book club membership properties
export interface IsMemberOfProperties {
  joined: string;
  departed?: string;
  role: Role;
}

/** RELATIONSHIPS */

// UserNode -> ProviderProfileNode
export interface HasProviderProfile extends Relationship {
  type: 'HAS_PROVIDER_PROFILE';
}

// UserNode -> BookClubNode
export interface IsMemberOf
  extends Relationship<Integer, IsMemberOfProperties, string> {
  type: 'IS_MEMBER_OF';
  properties: IsMemberOfProperties;
}
