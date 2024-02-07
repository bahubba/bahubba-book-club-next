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
  role: Role;
  joined: Date | string;
  isActive: boolean;
  departed?: Date | string;
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

/** TUPLES/COMBOS */

// Membership relationship properties with User email and preferred name properties
export interface BookClubMembership extends IsMemberOfProperties {
  email: string;
  preferredName: string;
}
