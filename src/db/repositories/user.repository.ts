import { Collection, InsertOneResult, UpdateResult } from 'mongodb';
import { Session } from 'neo4j-driver';

import { connectCollection } from '@/db/connect-mongo';
import { withNeo4jSession } from '@/db/connect-neo4j';
import {
  UserDoc,
  noMembershipsUserProjection,
  rawUserProjection
} from '@/db/models/user.models';
import {
  ProviderProfileNodeProps,
  UserNodeProps,
  UserNodeWithProviderProfile
} from '@/db/nodes/user.nodes';
import props from '@/util/properties';

/**
 * Add a new user to Neo4j, including User and ProviderProfile nodes and a relationship between them
 *
 * @param {UserNodeProps} user The properties for the User node
 * @param {string} provider The provider name
 * @param {ProviderProfileNodeProps} providerProfile The properties for the ProviderProfile node
 * @return {Promise<void>} A promise that resolves when the user is added
 */
export const addUser = withNeo4jSession()(
  async (
    session: Session,
    provider: string,
    user: UserNodeProps,
    providerProfile: ProviderProfileNodeProps
  ) => {
    await session.run(
      `
      CREATE (u:User $userProps)
      CREATE (p:ProviderProfile:${provider} $providerProfileProps)
      CREATE (u)-[:HAS_PROFILE]->(p)
      `,
      { userProps: user, providerProfileProps: providerProfile }
    );
  }
);

/**
 * Adds a provider profile to a user in Neo4j
 *
 * @param {string} email The user's email address
 * @param {string} provider The provider name
 * @param {ProviderProfileNodeProps} providerProfile The properties for the ProviderProfile node
 */
export const addProviderProfile = withNeo4jSession()(
  async (
    session: Session,
    email: string,
    provider: string,
    providerProfile: ProviderProfileNodeProps
  ) => {
    await session.run(
      `
      MATCH (u:User { email: $email })
      CREATE (p:ProviderProfile:${provider} $providerProfileProps)
      CREATE (u)-[:HAS_PROFILE]->(p)
      `,
      { email, providerProfileProps: providerProfile }
    );
  }
);

/**
 * Updates a provider profile for a user in Neo4j
 *
 * @param {string} email - The user's email address
 * @param {string} provider - The provider name
 * @param {ProviderProfileNodeProps} providerProfile - The properties for the ProviderProfile node
 */
export const updateProviderProfile = withNeo4jSession()(
  async (
    session: Session,
    email: string,
    provider: string,
    providerProfile: ProviderProfileNodeProps
  ) => {
    await session.run(
      `
      MATCH (p:ProviderProfile:${provider})<-[:HAS_PROFILE]-(:User { email: $email })
      SET p = $providerProfile
      `,
      { email, providerProfile }
    );
  }
);

/**
 * Find a user by email
 *
 * @param {string} email The user's email address
 * @return {Promise<UserNodeProps | null>} The user node properties if found, null otherwise
 */
export const findUser = withNeo4jSession()(
  async (session: Session, email: string): Promise<UserNodeProps | null> => {
    const result = await session.run(
      `
      MATCH (u:User { email: $email })
      RETURN u
      `,
      { email }
    );

    return result.records.length ? result.records[0].get('u') : null;
  }
);

/**
 * Find a user and provider profile by email and provider
 *
 * @param {string} email The user's email address
 * @param {string} provider The provider name
 * @return {Promise<UserNodeWithProviderProfile>} The user and provider profile nodes
 */
export const findUserAndProviderProfile = withNeo4jSession()(
  async (
    session: Session,
    email: string,
    provider: string
  ): Promise<UserNodeWithProviderProfile> => {
    console.log('email, provider', email, provider); // DELETEME
    const result = await session.run(
      `
      MATCH (u:User { email: $email })
      OPTIONAL MATCH (u)-[:HAS_PROFILE]->(p:ProviderProfile:${provider})
      RETURN u, p
      `,
      { email }
    );

    // console.log('u&p result', result); // DELETEME
    // console.log('u&p result.records', result.records); // DELETEME
    console.log('u&p result.records[0]', result.records[0]); // DELETEME
    console.log('u&p result.records[0].get("u")', result.records[0].get('u')); // DELETEME
    console.log('u&p result.records[0].get("p")', result.records[0].get('p')); // DELETEME

    return result.records.length
      ? {
          user: result.records[0].get('u'),
          profile: result.records[0].get('p')
        }
      : { user: null, profile: null };
  }
);

/**
 * Adds a user document to MongoDB
 *
 * @param {UserDoc} user The user document to add
 * @return {Promise<InsertOneResult<UserDoc>>} The result of the insert operation
 */
export const addMongoUser = async (
  user: UserDoc
): Promise<InsertOneResult<UserDoc>> => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // Add the user to the database
  return await collection.insertOne(user);
};

/**
 * Updates a user document in MongoDB
 *
 * @param {UserDoc} user The user document to update
 * @return {Promise<UpdateResult<UserDoc>>} The result of the update operation
 */
export const updateUser = async (
  user: UserDoc
): Promise<UpdateResult<UserDoc>> => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // TODO - Throw error if user._id is undefined
  // Update the user in the database
  return await collection.updateOne({ email: user.email }, { $set: user });
};

/**
 * Finds a user document by email
 *
 * @param {string} email The email address to search for
 * @return {UserDoc | null} The user document if found, null otherwise
 */
export const findFullUserByEmail = async (
  email: string
): Promise<UserDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // Find the user in the database
  return await collection.findOne(
    { email },
    { projection: noMembershipsUserProjection }
  );
};

/**
 * Finds a user document by email, without memberships or provider profiles
 *
 * @param {string} email The email address to search for
 * @return {UserDoc | null} The user document if found, null otherwise
 */
export const findUserByEmail = async (
  email: string
): Promise<UserDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // Find the user in the database
  return await collection.findOne({ email }, { projection: rawUserProjection });
};
