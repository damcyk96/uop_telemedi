export interface SummaryRowProps {
  label: string
  value: string
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
