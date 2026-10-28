import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavArrowDown } from 'iconoir-react'
import { HubButton } from './controls'
import { HubSpinner } from './feedback'

export type HubTableColumn<T> = {
  key: keyof T
  label: string
  align?: 'start' | 'end'
  emphasis?: boolean
  render?: (row: T) => ReactNode
}

export function HubTable<T extends { id: string }>({ label, columns, rows, pageSize = 10, loading = false }: {
  label: string; columns: HubTableColumn<T>[]; rows: T[]; pageSize?: number; loading?: boolean
}) {
  const [page, setPage] = useState(0)
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError('Table page size must be a positive integer')
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const first = currentPage * pageSize
  return <div className="hub-table" aria-busy={loading}>
    <div className="hub-table-scroll"><table>
      <caption className="hub-sr-only">{label}</caption>
      <thead><tr>{columns.map(column => <th scope="col" key={String(column.key)} className={column.align === 'end' ? 'text-right' : ''}>{column.label}</th>)}</tr></thead>
      <tbody>{!loading && rows.slice(first, first + pageSize).map(row => <tr key={row.id}>
        {columns.map(column => <td key={String(column.key)} className={`${column.align === 'end' ? 'text-right' : ''} ${column.emphasis ? 'is-strong' : ''}`}>
          {column.render ? column.render(row) : String(row[column.key] ?? '')}
        </td>)}
      </tr>)}</tbody>
    </table></div>
    {loading ? <HubSpinner label={`Loading ${label}`} /> : !rows.length && <p className="hub-table-empty" role="status">No results</p>}
    {rows.length > pageSize && !loading && <footer className="hub-table-pagination" aria-label={`${label} pagination`}>
      <span>{first + 1}-{Math.min(first + pageSize, rows.length)} of {rows.length}</span>
      <div className="hub-row">
        <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button>
        <strong aria-live="polite">Page {currentPage + 1} of {pageCount}</strong>
        <button type="button" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>Next</button>
      </div>
    </footer>}
  </div>
}

export function HubLoadMore({ canLoadMore, loading = false, onLoad }: {
  canLoadMore: boolean; loading?: boolean; onLoad: () => void
}) {
  if (!canLoadMore && !loading) return null
  return <div className="hub-load-more" aria-live="polite">
    {loading ? <HubSpinner label="Loading more results" /> : <HubButton icon={<NavArrowDown />} onClick={onLoad}>Load more</HubButton>}
  </div>
}
