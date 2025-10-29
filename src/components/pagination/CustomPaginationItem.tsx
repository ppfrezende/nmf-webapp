import { Button } from '../ui/button'

interface PaginationItemProps {
  number: number
  isCurrent?: boolean
  onPageChange: (page: number) => void
}

export function CustomPaginationItem({
  isCurrent = false,
  number,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return <Button className="size-8">{number}</Button>
  }

  return (
    <Button
      variant="secondary"
      className="size-8"
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  )
}
