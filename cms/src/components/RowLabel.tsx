'use client'
// List item title in the admin: "Rug Cleaning" instead of "Card 01".
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = ({ field, fallback }: { field: string; fallback: string }) => {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const value = data?.[field]
  const text = typeof value === 'string' ? value.replace(/\*/g, '').trim() : ''
  return <span>{text || `${fallback} ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
