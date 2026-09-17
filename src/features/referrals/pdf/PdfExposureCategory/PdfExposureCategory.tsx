import type { ComponentProps } from 'react'
import { Text, View } from '@react-pdf/renderer'

export interface PdfExposureCategoryProps {
  label: string
  factorNames: string[]
  emptyText: string
  style: ComponentProps<typeof View>['style']
}

export function PdfExposureCategory({ label, factorNames, emptyText, style }: PdfExposureCategoryProps) {
  return (
    <View style={style}>
      <Text style={{ fontWeight: 700 }}>{label}</Text>
      <Text>{factorNames.length ? factorNames.join(', ') : emptyText}</Text>
    </View>
  )
}
