import { BookClubProperties } from '@/db/models/nodes';

// Basic interface for form state that includes an error message
export interface ErrorFormState {
  error: string;
}

// Search page form state
export interface SearchFormState extends ErrorFormState {
  bookClubs: BookClubProperties[];
}
