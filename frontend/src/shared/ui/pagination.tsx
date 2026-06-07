import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        leftIcon={<ChevronLeft className="size-4" />}
      >
        Назад
      </Button>

      <span className="text-sm text-muted-foreground">
        Страница <span className="font-medium text-foreground">{page}</span> из{' '}
        {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперёд
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
