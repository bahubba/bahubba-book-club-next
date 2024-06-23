'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/input';

import SubmitButton from '@/components/buttons/submit.button';

/** Search bar/form for finding books */
const BookSearchForm = ({ urlPath }: { urlPath: string }) => {
  // Router for navigating (adding query parameters
  const router = useRouter();

  // Search query state
  const [query, setQuery] = useState('');

  // On form submission, redirect with URL query params
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Stop the default form submission
    e.preventDefault();

    // If there is a query,
    if(query.length) router.push(`${urlPath}?query=${query}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-shrink flex items-center gap-x-1 min-w-[50vw]">
        <Input
          className="flex-1 "
          name="search"
          size="sm"
          variant="bordered"
          placeholder="Search for a book"
          value={query}
          onValueChange={setQuery}
          required
          isRequired
        />
        <div className="flex-shrink">
          <SubmitButton
            size="md"
            buttonText="Search"
            color="secondary"
            disabled={query.length === 0}
          />
        </div>
      </div>
    </form>
  )
};

export default BookSearchForm;
