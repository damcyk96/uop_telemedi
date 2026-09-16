export type ID = string
export interface Address { street: string; postalCode: string; city: string }
export interface Company { id?: string; name: string; nip: string; address: Address }
export interface User { id: ID; firstName: string; lastName: string; role: 'COORDINATOR' | 'HR'; login: string; password: string; createdAt: string }
export interface Employee { id: ID; firstName: string; lastName: string; hasPesel: boolean; pesel?: string; documentType?: 'passport'|'id_card'|'residence_card'|'other'; documentNumber?: string; birthDate?: string; address: Address; phone?: string; email?: string; position: string }
export type FactorCategory = 'PHYSICAL'|'DUST'|'CHEMICAL'|'BIOLOGICAL'|'OTHER'
export interface ExposureFactor { id: ID; category: FactorCategory; name: string; source: 'SYSTEM'|'CUSTOM' }
export interface ReferralTemplate { id: ID; name: string; factorIds: ID[] }
export type ExamType = 'INITIAL'|'PERIODIC'|'CONTROL'
export type ReferralStatus = 'ISSUED'|'IN_PROGRESS'|'SCHEDULED'|'COMPLETED'
export interface Referral { id: ID; number: string; examType: ExamType; employee: Employee; position: string; workConditions?: string; factors: ExposureFactor[]; resultDeadline: string; preferredCity: string; notes?: string; status: ReferralStatus; createdAt: string }
