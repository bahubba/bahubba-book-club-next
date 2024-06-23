// Component props
interface BookListDataFetcherProps {
  query: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * Fetcher for book club search results; Wraps the book club list
 *
 * @param {Object} props
 * @param {string} props.query The search string
 * @param {number} props.pageNum The page number for results
 * @param {pageSize} props.pageSize The number of results per page
 */
const BookListDataFetcher = async ({
  query,
  pageNum = 1,
  pageSize = 25
}: BookListDataFetcherProps) => {
  // Fetch the results
}