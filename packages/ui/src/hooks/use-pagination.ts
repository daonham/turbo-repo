import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { useTablePagination } from '../table/use-table-pagination';

export const PAGINATION_LIMIT = 100;

export function usePagination(pageSize = PAGINATION_LIMIT) {
  const [page, setPage] = useQueryState('page');

  const { pagination, setPagination } = useTablePagination({
    pageSize,
    page: page ? parseInt(page) : 1,
    onPageChange: (p) => {
      setPage(p.toString());
    }
  });

  // Update state when URL parameter changes
  useEffect(() => {
    setPagination((p) => ({
      ...p,
      pageIndex: page ? parseInt(page) : 1
    }));
  }, [page]);

  // Update URL parameter when state changes
  useEffect(() => {
    setPage(pagination.pageIndex.toString());
  }, [pagination]);

  return { pagination, setPagination };
}
