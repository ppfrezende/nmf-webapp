import { CustomPaginationItem } from './CustomPaginationItem'

interface PaginationProps {
  isSearch?: boolean
  totalOfResults: number
  totalCountOfRegisters?: number
  registerPerPage?: number
  currentPage?: number
  onPageChange: (page: number) => void
}

const siblingsCount = 1

function generatePageArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1
    })
    .filter((page) => page > 0)
}

export function CustomPagination({
  isSearch,
  totalOfResults,
  totalCountOfRegisters,
  registerPerPage = 10,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage =
    totalCountOfRegisters && Math.ceil(totalCountOfRegisters / registerPerPage)

  const previousPages =
    currentPage > 1
      ? generatePageArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : []

  const nextPages =
    lastPage && currentPage < lastPage
      ? generatePageArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : []

  const actualRangePage =
    currentPage < 2
      ? `${currentPage}`
      : currentPage < 3
        ? `${registerPerPage + 1}`
        : `${(currentPage - 1) * registerPerPage + 1}`

  const actualLimitPage =
    currentPage === lastPage
      ? `${totalCountOfRegisters}`
      : currentPage < 2
        ? `${registerPerPage}`
        : `${currentPage * registerPerPage}`

  return (
    <>
      {isSearch && totalOfResults >= 0 ? (
        <div className="mt-4 flex flex-row items-center justify-between space-x-6">
          <div>
            <p className="text-xs">
              <strong>{totalOfResults}</strong>{' '}
              {`resultado${totalOfResults > 1 ? 's' : ''} encontrado${
                totalOfResults > 1 ? 's' : ''
              }`}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-row items-center justify-between space-x-6">
          <div>
            <p className="text-xs">
              <strong>{actualRangePage}</strong> -{' '}
              <strong>{actualLimitPage}</strong> de{' '}
              <strong>{totalCountOfRegisters}</strong>
            </p>
          </div>
          <div className="flex flex-row space-x-2">
            {currentPage > 1 + siblingsCount && (
              <>
                <CustomPaginationItem onPageChange={onPageChange} number={1} />
                {currentPage > 2 + siblingsCount && (
                  <p className="w-8 text-center text-gray-800">...</p>
                )}
              </>
            )}

            {previousPages.length > 0 &&
              previousPages.map((page) => {
                return (
                  <CustomPaginationItem
                    onPageChange={onPageChange}
                    key={page}
                    number={page}
                  />
                )
              })}

            <CustomPaginationItem
              onPageChange={onPageChange}
              number={currentPage}
              isCurrent
            />

            {nextPages.length > 0 &&
              nextPages.map((page) => {
                return (
                  <CustomPaginationItem
                    onPageChange={onPageChange}
                    key={page}
                    number={page}
                  />
                )
              })}

            {lastPage && currentPage + siblingsCount < lastPage && (
              <>
                {currentPage + 1 + siblingsCount < lastPage && (
                  <p className="w-8 text-center text-gray-800">...</p>
                )}
                <CustomPaginationItem
                  onPageChange={onPageChange}
                  number={lastPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
