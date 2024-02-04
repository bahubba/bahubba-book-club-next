import neo4j, { Session } from 'neo4j-driver';

import props from '@/util/properties';

// Neo4j driver and session
export const driver = neo4j.driver(
  props.DB.BBCM_AURA_URI,
  neo4j.auth.basic(props.DB.BBCM_AURA_USERNAME, props.DB.BBCM_AURA_PW)
);

export const withNeo4jSession =
  () =>
  (fn: (session: Session, ...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    const neo4jSession = driver.session();
    try {
      return await fn(neo4jSession, ...args);
    } finally {
      await neo4jSession.close();
    }
  };

// Example usage
// export const runQuery = withNeo4jSession()(async (session: Session, query: string, params: any) => {
//   const result = await session.run(query, params);
//   return result.records;
// });
