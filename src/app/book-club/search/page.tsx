'use client';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { searchBookClubs } from '@/api/fetchers/book-club.fetchers';
import { BookClubDoc } from '@/db/models/book-club.models';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import BookClubCardGridLayout from '@/components/layout/book-club-card-grid.layout';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

/** Async function for loading book clubs to display */
const fetchBookClubs = async (searchQuery: string) =>
  !searchQuery ? [] : await searchBookClubs(searchQuery);

/** Search page for finding book clubs */
const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookClubs, setBookClubs] = useState<BookClubDoc[]>([]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  const handleSubmitSearch = async () => {
    setBookClubs(await fetchBookClubs(searchQuery));
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-y-2 max-w-[75%] max-h-fill-below-header">
        <h1 className="flex-shrink text-2xl font-bold">Book Club Search</h1>
        <div className="flex-shrink flex items-center gap-x-1">
          <Input
            className="flex-1"
            size="sm"
            variant="bordered"
            placeholder="Search for a book club"
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <Button
            className="flex-shrink"
            size="lg"
            color={searchQuery.trim() ? 'secondary' : 'default'}
            onClick={handleSubmitSearch}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </div>
        <Divider />
        <ScrollShadow
          hideScrollBar
          size={100}
          className="flex-1 overflow-y-auto max-h-screen"
        >
          {bookClubs && (
            <BookClubCardGridLayout
              cols={6}
              bookClubs={bookClubs}
            />
          )}
        </ScrollShadow>
      </div>
    </div>
  );
};

export default SearchPage;
