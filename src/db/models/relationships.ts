import { Relationship } from 'neo4j-driver';

/** RELATIONSHIPS */

// UserNode -> ProviderProfileNode
export interface HasProviderProfile extends Relationship {
  type: 'HAS_PROVIDER_PROFILE';
}

// MembershipNode -> PickNode
export interface RatedProperties {
  rating: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10
  ratedOn: Date | string;
  isLatest: boolean;
  comments?: string;
}
