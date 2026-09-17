import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { examTypes, factorCategories } from '@/domain/catalogs'
import type { Company, FactorCategory, Referral } from '@/domain/types'
import type { Translate } from '@/i18n'
import { PdfExposureCategory } from '@/features/referrals/pdf/PdfExposureCategory'

const styles = StyleSheet.create({
  page: { padding: 38, fontFamily: 'Helvetica', fontSize: 9, color: '#26322a', lineHeight: 1.35 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 18 },
  employer: { width: '58%' },
  right: { width: '38%', textAlign: 'right' },
  small: { fontSize: 7.5, color: '#66706a' },
  title: { fontSize: 15, fontWeight: 700, textAlign: 'center', marginTop: 28, marginBottom: 5 },
  subtitle: { fontSize: 9, textAlign: 'center', marginBottom: 20 },
  section: { borderTop: '1 solid #cbd4cd', paddingTop: 8, marginTop: 10 },
  label: { fontSize: 7.5, color: '#68736c', marginBottom: 2 },
  value: { fontSize: 9.5 },
  category: { marginTop: 7, padding: 7, backgroundColor: '#f5f7f5', borderLeft: '3 solid #4ec96f' },
  deadline: { marginTop: 14, padding: 10, backgroundColor: '#e8f5ed', border: '1 solid #b7d8c1' },
  footer: { marginTop: 28, flexDirection: 'row', justifyContent: 'space-between' },
  signature: { width: 170, borderTop: '1 solid #777', paddingTop: 5, textAlign: 'center' },
})

export interface ReferralPdfProps {
  referral: Referral
  company: Company
  t: Translate
}

export function ReferralPdf({ referral, company, t }: ReferralPdfProps) {
  const { employee } = referral
  const personId = employee.hasPesel
    ? t('referrals.pdf.pesel', { pesel: employee.pesel ?? '' })
    : t('referrals.pdf.document', {
      documentType: employee.documentType ? t(`domain.documentTypes.${employee.documentType}`) : '',
      documentNumber: employee.documentNumber ?? '',
      birthDate: employee.birthDate ?? '',
    })

  function renderExposureCategory(category: FactorCategory) {
    const factorNames = referral.factors
      .filter(factor => factor.category === category)
      .map(factor => factor.name)

    return (
      <PdfExposureCategory
        key={category}
        label={t(`domain.factorCategories.${category}.label`)}
        factorNames={factorNames}
        emptyText={t('referrals.pdf.noFactors')}
        style={styles.category}
      />
    )
  }

  return (
    <Document title={referral.number}>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View style={styles.employer}>
            <Text style={styles.label}>{t('referrals.pdf.employer')}</Text>
            <Text style={styles.value}>{company.name}</Text>
            <Text>{company.address.street}, {company.address.postalCode} {company.address.city}</Text>
            <Text>{t('referrals.pdf.nip', { nip: company.nip })}</Text>
          </View>
          <View style={styles.right}>
            <Text>{company.address.city}, {new Date(referral.createdAt).toLocaleDateString('pl-PL')}</Text>
            <Text style={[styles.small, { marginTop: 8 }]}>{t('referrals.pdf.numberLabel')}</Text>
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{referral.number}</Text>
          </View>
        </View>
        <Text style={styles.title}>{t('referrals.pdf.title')}</Text>
        <Text style={styles.subtitle}>
          {examTypes
            .map(type => `${t(type === referral.examType ? 'referrals.pdf.checked' : 'referrals.pdf.unchecked')} ${t(`domain.examTypes.${type}`)}`)
            .join('     ')}
        </Text>
        <Text>{t('referrals.pdf.legalBasis')}</Text>
        <View style={styles.section}>
          <Text style={styles.label}>{t('referrals.pdf.employee')}</Text>
          <Text style={{ fontSize: 12, fontWeight: 700 }}>
            {referral.employee.firstName} {referral.employee.lastName}
          </Text>
          <Text>{personId}</Text>
          <Text>
            {referral.employee.address.street}, {referral.employee.address.postalCode} {referral.employee.address.city}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('referrals.pdf.position')}</Text>
          <Text style={styles.value}>{referral.position}</Text>
          {referral.workConditions ? <Text style={{ marginTop: 4 }}>{referral.workConditions}</Text> : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{t('referrals.pdf.factors')}</Text>
          {factorCategories.map(renderExposureCategory)}
        </View>
        <Text style={{ marginTop: 9, fontWeight: 700 }}>
          {t('referrals.pdf.factorTotal', { count: referral.factors.length })}
        </Text>
        <View style={styles.deadline}>
          <Text style={styles.label}>{t('referrals.pdf.deadline')}</Text>
          <Text style={{ fontSize: 13, fontWeight: 700 }}>
            {new Date(`${referral.resultDeadline}T12:00:00`).toLocaleDateString('pl-PL')}
          </Text>
          <Text style={{ marginTop: 4 }}>{t('referrals.pdf.examCity', { city: referral.preferredCity })}</Text>
        </View>
        {referral.notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>{t('referrals.pdf.notes')}</Text>
            <Text>{referral.notes}</Text>
          </View>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.small}>{t('referrals.pdf.copies')}</Text>
          <Text style={styles.signature}>{t('referrals.pdf.signature')}</Text>
        </View>
      </Page>
    </Document>
  )
}
