import { Integer, Relationship } from 'neo4j-driver';

/** RELATIONSHIPS */

// UserNode -> ProviderProfileNode
export interface HasProviderProfile extends Relationship {
  type: 'HAS_PROVIDER_PROFILE';
}
