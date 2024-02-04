import { Relationship } from 'neo4j-driver';

// UserNode -> ProviderProfileNode
export interface HasProviderProfile extends Relationship {
  type: 'HAS_PROVIDER_PROFILE';
}
