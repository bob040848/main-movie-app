import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const maxPages = Math.min(totalPages, 10);

  const getPageNumbers = (): number[] => {
    if (maxPages <= 7) {
      return Array.from({ length: maxPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, maxPages];
    } else if (currentPage >= maxPages - 3) {
      return [
        1,
        maxPages - 4,
        maxPages - 3,
        maxPages - 2,
        maxPages - 1,
        maxPages,
      ];
    } else {
      return [1, currentPage - 1, currentPage, currentPage + 1, maxPages];
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center mt-8 ${className}`}>
      <div className="flex items-center gap-1 bg-white dark:bg-black p-1 rounded-lg transition-colors">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center">
          {pageNumbers.map((pageNumber, index) => {
            const needsEllipsisBefore =
              index > 0 && pageNumber > pageNumbers[index - 1] + 1;

            return (
              <div key={pageNumber} className="flex items-center">
                {needsEllipsisBefore && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-8 h-8 p-0 rounded-md font-medium ${
                    currentPage === pageNumber
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onPageChange(pageNumber)}
                  disabled={isLoading}
                >
                  {pageNumber}
                </Button>
              </div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.min(currentPage + 1, maxPages))}
          disabled={currentPage === maxPages || isLoading}
          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
