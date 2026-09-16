import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Company, Referral } from '../../domain/types'
import { categories, examLabels } from '../../domain/labels'

const s = StyleSheet.create({
  page: { padding: 38, fontFamily: 'Helvetica', fontSize: 9, color: '#26322a', lineHeight: 1.35 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 18 },
  employer: { width: '58%' }, right: { width: '38%', textAlign: 'right' },
  small: { fontSize: 7.5, color: '#66706a' }, title: { fontSize: 15, fontWeight: 700, textAlign: 'center', marginTop: 28, marginBottom: 5 },
  subtitle: { fontSize: 9, textAlign: 'center', marginBottom: 20 },
  section: { borderTop: '1 solid #cbd4cd', paddingTop: 8, marginTop: 10 },
  label: { fontSize: 7.5, color: '#68736c', marginBottom: 2 }, value: { fontSize: 9.5 },
  category: { marginTop: 7, padding: 7, backgroundColor: '#f5f7f5', borderLeft: '3 solid #4ec96f' },
  deadline: { marginTop: 14, padding: 10, backgroundColor: '#e8f5ed', border: '1 solid #b7d8c1' },
  footer: { marginTop: 28, flexDirection: 'row', justifyContent: 'space-between' }, signature: { width: 170, borderTop: '1 solid #777', paddingTop: 5, textAlign: 'center' },
})

export function ReferralPdf({ referral, company }: { referral: Referral; company: Company }) {
  const personId = referral.employee.hasPesel ? `PESEL: ${referral.employee.pesel}` : `${referral.employee.documentType}: ${referral.employee.documentNumber}, data urodzenia: ${referral.employee.birthDate}`
  return <Document title={referral.number}>
    <Page size="A4" style={s.page}>
      <View style={s.row}>
        <View style={s.employer}><Text style={s.label}>PRACODAWCA</Text><Text style={s.value}>{company.name}</Text><Text>{company.address.street}, {company.address.postalCode} {company.address.city}</Text><Text>NIP {company.nip}</Text></View>
        <View style={s.right}><Text>{company.address.city}, {new Date(referral.createdAt).toLocaleDateString('pl-PL')}</Text><Text style={[s.small, { marginTop: 8 }]}>Numer skierowania</Text><Text style={{ fontSize: 11, fontWeight: 700 }}>{referral.number}</Text></View>
      </View>
      <Text style={s.title}>SKIEROWANIE NA BADANIA LEKARSKIE</Text>
      <Text style={s.subtitle}>{(['INITIAL','PERIODIC','CONTROL'] as const).map(x => `${x === referral.examType ? '[X]' : '[ ]'} ${examLabels[x]}`).join('     ')}</Text>
      <Text>Dzialajac na podstawie art. 229 par. 4a Kodeksu pracy kieruje na badania lekarskie:</Text>
      <View style={s.section}><Text style={s.label}>PRACOWNIK</Text><Text style={{ fontSize: 12, fontWeight: 700 }}>{referral.employee.firstName} {referral.employee.lastName}</Text><Text>{personId}</Text><Text>{referral.employee.address.street}, {referral.employee.address.postalCode} {referral.employee.address.city}</Text></View>
      <View style={s.section}><Text style={s.label}>STANOWISKO PRACY</Text><Text style={s.value}>{referral.position}</Text>{referral.workConditions ? <Text style={{ marginTop: 4 }}>{referral.workConditions}</Text> : null}</View>
      <View style={s.section}><Text style={s.label}>CZYNNIKI NARAZENIA</Text>{categories.map(cat => { const names = referral.factors.filter(f => f.category === cat.key).map(f => f.name); return <View key={cat.key} style={s.category}><Text style={{ fontWeight: 700 }}>{cat.label}</Text><Text>{names.length ? names.join(', ') : 'brak'}</Text></View> })}</View>
      <Text style={{ marginTop: 9, fontWeight: 700 }}>Laczna liczba czynnikow wskazanych w skierowaniu: {referral.factors.length}</Text>
      <View style={s.deadline}><Text style={s.label}>TERMIN DOSTARCZENIA ORZECZENIA</Text><Text style={{ fontSize: 13, fontWeight: 700 }}>{new Date(`${referral.resultDeadline}T12:00:00`).toLocaleDateString('pl-PL')}</Text><Text style={{ marginTop: 4 }}>Miejscowosc badania: {referral.preferredCity}</Text></View>
      {referral.notes ? <View style={s.section}><Text style={s.label}>UWAGI DLA CALL CENTER</Text><Text>{referral.notes}</Text></View> : null}
      <View style={s.footer}><Text style={s.small}>Skierowanie wydano w dwóch egzemplarzach.</Text><Text style={s.signature}>podpis pracodawcy</Text></View>
    </Page>
  </Document>
}
