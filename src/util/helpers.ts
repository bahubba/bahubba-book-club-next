/**
 * Convert to JSON for return to client
 *
 * @param {Object} data
 * @return {Object} The data as JSON
 */
export const toJSON = (data: Object): Object | [] | string | number | boolean | null => JSON.parse(JSON.stringify(data));
