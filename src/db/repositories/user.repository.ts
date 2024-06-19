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
 * @param {ProviderProfileProperties} providerProfile The properties for the ProviderProfile node
 * @return {Promise<void>} A promise that resolves when the user is added
 */
export const addUser = async (
  user: UserProperties,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the user and provider profile
  await session.run(
    `
      CREATE (u:User $userProps)
      CREATE (p:ProviderProfile $providerProfileProps)
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
 * @param {ProviderProfileProperties} providerProfile The properties for the ProviderProfile node
 */
export const addProviderProfile = async (
  email: string,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the provider profile with a relationship from the user
  await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      CREATE (p:ProviderProfile $providerProfileProps)
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
 * @param {ProviderProfileProperties} providerProfile - The properties for the ProviderProfile node
 */
export const updateProviderProfile = async (
  email: string,
  providerProfile: ProviderProfileProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Pull out the provider and user ID to ensure we get only the correct profile
  const { provider, userId } = providerProfile;

  // Update the provider profile
  await session.run(
    `
      MATCH (p:ProviderProfile { isActive: TRUE, provider: $provider, userId: $userId })<-[:HAS_PROFILE]-(:User { email: $email, isActive: TRUE })
      SET p = $providerProfile
      `,
    { email, provider, userId, providerProfile }
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
 * @param {string} userId The user's ID from the provider profile
 * @return {Promise<UserAndProviderProfile>} The user and provider profile nodes
 */
export const findUserAndProviderProfile = async (
  email: string,
  provider: string,
  userId: string
): Promise<UserAndProviderProfile> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the user and provider profile
  const result = await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      OPTIONAL MATCH (u)-[:HAS_PROFILE]->(p:ProviderProfile { isActive: TRUE, provider: $provider, userId: $userId })
      RETURN u, p
      `,
    { email, provider, userId }
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
