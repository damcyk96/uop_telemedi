import type { ReactNode } from 'react'
import { LoadingIndicator } from '@/ui/atoms'
import { EmptyState, type EmptyStateProps } from '@/ui/molecules'

export interface DataTableColumn {
  header: string
  align?: 'right'
}

export interface DataTableProps<TRow> {
  label: string
  caption: string
  columns: DataTableColumn[]
  rows: TRow[]
  loading: boolean
  empty: EmptyStateProps
  renderRow: (row: TRow) => ReactNode
}

export function DataTable<TRow>({ label, caption, columns, rows, loading, empty, renderRow }: DataTableProps<TRow>) {
  function renderHeader(column: DataTableColumn) {
    return (
      <th key={column.header} className={column.align}>{column.header}</th>
    )
  }

  function renderContent() {
    if (loading) {
      return (
        <LoadingIndicator />
      )
    }
    if (!rows.length) {
      return (
        <EmptyState {...empty} />
      )
    }
    return (
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{columns.map(renderHeader)}</tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    )
  }

  return (
    <div className="table-card" role="region" aria-label={label} tabIndex={0}>
      {renderContent()}
    </div>
  )
}
