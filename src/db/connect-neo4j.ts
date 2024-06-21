import neo4j from 'neo4j-driver';

import props from '@/util/properties';

// Neo4j driver and session
export const driver = neo4j.driver(
  props.DB.AURA_URI,
  neo4j.auth.basic(props.DB.AURA_USERNAME, props.DB.AURA_PW)
);
