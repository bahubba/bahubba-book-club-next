import { driver } from '@/db/connect-neo4j';
import {
  ProviderProfileProperties,
  UserAndProviderProfile,
  UserProperties
} from '../models/nodes';

/**
 * Add a new user to Neo4j, including User and ProviderProfile nodes and a relationship between them
 *
 * @param {UserProperties} user The properties for the User node
 * @param {string} provider The provider name
 * @param {ProviderProfileNodeProps} providerProfile The properties for the ProviderProfile node
 * @return {Promise<void>} A promise that resolves when the user is added
 */
export const addUser = async (
  provider: string,
  user: UserProperties,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  console.log('user', user); // DELETEME

  // Add the user and provider profile
  await session.run(
    `
      CREATE (u:User $userProps)
      CREATE (p:ProviderProfile:${provider} $providerProfileProps)
      CREATE (u)-[:HAS_PROFILE]->(p)
      `,
    { userProps: user, providerProfileProps: providerProfile }
  );

  // Close the session
  session.close();
};

/**
 * Adds a provider profile to a user in Neo4j
 *
 * @param {string} email The user's email address
 * @param {string} provider The provider name
 * @param {ProviderProfileProperties} providerProfile The properties for the ProviderProfile node
 */
export const addProviderProfile = async (
  email: string,
  provider: string,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the provider profile with a relationship from the user
  await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      CREATE (p:ProviderProfile:${provider} $providerProfileProps)
      CREATE (u)-[:HAS_PROFILE]->(p)
      `,
    { email, providerProfileProps: providerProfile }
  );

  // Close the session
  session.close();
};

/**
 * Updates a provider profile for a user in Neo4j
 *
 * @param {string} email - The user's email address
 * @param {string} provider - The provider name
 * @param {ProviderProfileProperties} providerProfile - The properties for the ProviderProfile node
 */
export const updateProviderProfile = async (
  email: string,
  provider: string,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Update the provider profile
  await session.run(
    `
      MATCH (p:ProviderProfile:${provider} { isActive: TRUE })<-[:HAS_PROFILE]-(:User { email: $email, isActive: TRUE })
      SET p = $providerProfile
      `,
    { email, providerProfile }
  );

  // Close the session
  session.close();
};

/**
 * Find a user by email
 *
 * @param {string} email The user's email address
 * @return {Promise<UserProperties | null>} The user node properties if found, null otherwise
 */
export const findUser = async (
  email: string
): Promise<UserProperties | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the user
  const result = await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      RETURN u
      `,
    { email }
  );

  // Close the session and return the user
  session.close();
  return result.records.length
    ? (result.records[0].get('u').properties as UserProperties)
    : null;
};

/**
 * Find a user and provider profile by email and provider
 *
 * @param {string} email The user's email address
 * @param {string} provider The provider name
 * @return {Promise<UserAndProviderProfile>} The user and provider profile nodes
 */
export const findUserAndProviderProfile = async (
  email: string,
  provider: string
): Promise<UserAndProviderProfile> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the user and provider profile
  const result = await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      OPTIONAL MATCH (u)-[:HAS_PROFILE { isActive: TRUE }]->(p:ProviderProfile:${provider} { isActive: TRUE })
      RETURN u, p
      `,
    { email }
  );

  // Close the session
  session.close();

  // Pull the user and provider profile properties from the result
  return result.records.length
    ? {
        user: result.records[0].get('u')?.properties ?? null,
        profile: result.records[0].get('p')?.properties ?? null
      }
    : { user: null, profile: null };
};
