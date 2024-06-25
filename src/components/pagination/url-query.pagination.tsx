'use client';

import { useRouter } from 'next/navigation';
import { Pagination } from '@nextui-org/pagination';

// Component props
interface PaginationProps {
  url: string;
  total: number;
  pageNum?: number;
  pageSize?: number;
}

/**
 * Client-side component to handle pagination via redirect with URL query params
 *
 * @param {Object} props Component props
 * @param {string} props.url The URL prefix to redirect to with new query params
 * @param {number} props.total The total number of pages
 * @param {number} props.pageNum The current page number
 */
const URLQueryPagination = ({ url, total, pageNum = 1, pageSize = 10 }: Readonly<PaginationProps>) => {
  // Router used to navigate after selecting a tab
  const router = useRouter();

  // Redirect to the new URL with the updated page number
  const handlePageChange = (newPageNum: number) => {
    router.push(`${url}?pageNum=${newPageNum}&pageSize=${pageSize}`);
  }

    return (
      <>
        <Pagination
          variant="faded"
          size="sm"
          color="secondary"
          showControls
          total={total}
          page={pageNum}
          onChange={handlePageChange}
        />
      </>
    );
};

export default URLQueryPagination;