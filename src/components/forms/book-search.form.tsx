'use client';

import { Input } from '@nextui-org/input';

import SubmitButton from '@/components/buttons/submit.button';

// Component props
interface BookSearchFormProps {
  formAction: (payload: FormData) => void;
}

/**
 * Search bar/form for finding books
 *
 * @param {Object} props
 * @param {Function} props.formAction Callback function for search form submission
 */
const BookSearchForm = ({ formAction }: Readonly<BookSearchFormProps>) => (
  <form action={formAction}>
    <div className="flex-shrink flex items-center gap-x-1">
      <Input
        className="flex-1"
        name="search"
        size="sm"
        variant="bordered"
        placeholder="Search for a book"
        required
        isRequired
      />
      <div className="flex-shrink">
        <SubmitButton
          size="lg"
          buttonText="Search"
          color="secondary"
        />
      </div>
    </div>
  </form>
)
