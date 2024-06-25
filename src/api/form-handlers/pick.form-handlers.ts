'use server';

import { addPick } from '@/db/repositories/pick.repository';

import { ErrorFormState } from '@/api/form-handlers/state-interfaces';

/**
 * Handle picking a book for a club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book club slug and the ID of book being selected
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */