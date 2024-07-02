'use client';

import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

import BookClubCardGridLayout from '@/components/layout/book-club-card-grid.layout';
import SubmitButton from '@/components/buttons/submit.button';
import { handleBookClubSearch } from '@/api/form-handlers/book-club.form-handlers';

/** Form for searching for book clubs */
const BookClubSearchForm = () => {
  // Form state
  const [formState, formAction] = useFormState(handleBookClubSearch, {
    error: '',
    bookClubs: []
  });

  return (
    <>
      <form action={formAction}>
        <div className="flex-shrink flex items-center gap-x-1">
          <Input
            className="flex-1"
            name="search"
            size="sm"
            variant="bordered"
            placeholder="Search for a book club"
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
      <Divider />
      <ScrollShadow
        hideScrollBar
        size={100}
        className="flex-1 pb-2 overflow-y-auto max-h-fill-below-header"
      >
        {formState.bookClubs.length > 0 && (
          <BookClubCardGridLayout
            cols="6"
            bookClubs={formState.bookClubs}
          />
        )}
      </ScrollShadow>
    </>
  );
};

export default BookClubSearchForm;
