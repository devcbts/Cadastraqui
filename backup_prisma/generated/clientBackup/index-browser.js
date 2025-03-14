
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.3.1
 * Query Engine version: 61e140623197a131c2a6189271ffee05a7aa9a59
 */
Prisma.prismaVersion = {
  client: "5.3.1",
  engine: "61e140623197a131c2a6189271ffee05a7aa9a59"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.IdMappingScalarFieldEnum = {
  id: 'id',
  mainId: 'mainId',
  newId: 'newId',
  application_id: 'application_id'
};

exports.Prisma.CandidateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  CPF: 'CPF',
  main_id: 'main_id',
  birthDate: 'birthDate',
  role: 'role',
  createdAt: 'createdAt',
  user_id: 'user_id',
  responsible_id: 'responsible_id',
  profilePicture: 'profilePicture',
  email: 'email',
  finishedapplication: 'finishedapplication',
  application_id: 'application_id',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  profilePicture: 'profilePicture',
  updatedAt: 'updatedAt'
};

exports.Prisma.LegalResponsibleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  main_id: 'main_id',
  CPF: 'CPF',
  birthDate: 'birthDate',
  livesAtSameAddress: 'livesAtSameAddress',
  institutionType: 'institutionType',
  responsibleEducationLevel: 'responsibleEducationLevel',
  responsibleGradeOrSemester: 'responsibleGradeOrSemester',
  responsibleShift: 'responsibleShift',
  ResponsibleEducationInstitution: 'ResponsibleEducationInstitution',
  role: 'role',
  createdAt: 'createdAt',
  user_id: 'user_id',
  hasScholarship: 'hasScholarship',
  monthlyAmount: 'monthlyAmount',
  percentageOfScholarship: 'percentageOfScholarship',
  application_id: 'application_id',
  updatedAt: 'updatedAt'
};

exports.Prisma.IdentityDetailsScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  socialName: 'socialName',
  main_id: 'main_id',
  birthDate: 'birthDate',
  gender: 'gender',
  nationality: 'nationality',
  natural_city: 'natural_city',
  natural_UF: 'natural_UF',
  CPF: 'CPF',
  RG: 'RG',
  rgIssuingAuthority: 'rgIssuingAuthority',
  rgIssuingState: 'rgIssuingState',
  documentType: 'documentType',
  CadUnico: 'CadUnico',
  hasSevereDeseaseOrUsesMedication: 'hasSevereDeseaseOrUsesMedication',
  hasBankAccount: 'hasBankAccount',
  isIncomeUpdated: 'isIncomeUpdated',
  incomeUpdatedStatus: 'incomeUpdatedStatus',
  documentNumber: 'documentNumber',
  documentValidity: 'documentValidity',
  maritalStatus: 'maritalStatus',
  skinColor: 'skinColor',
  religion: 'religion',
  educationLevel: 'educationLevel',
  specialNeeds: 'specialNeeds',
  address: 'address',
  addressNumber: 'addressNumber',
  complement: 'complement',
  neighborhood: 'neighborhood',
  city: 'city',
  UF: 'UF',
  CEP: 'CEP',
  specialNeedsDescription: 'specialNeedsDescription',
  specialNeedsType: 'specialNeedsType',
  hasMedicalReport: 'hasMedicalReport',
  email: 'email',
  landlinePhone: 'landlinePhone',
  workPhone: 'workPhone',
  contactNameForMessage: 'contactNameForMessage',
  profession: 'profession',
  enrolledGovernmentProgram: 'enrolledGovernmentProgram',
  NIS: 'NIS',
  incomeSource: 'incomeSource',
  livesAlone: 'livesAlone',
  intendsToGetScholarship: 'intendsToGetScholarship',
  attendedPublicHighSchool: 'attendedPublicHighSchool',
  benefitedFromCebasScholarship_basic: 'benefitedFromCebasScholarship_basic',
  yearsBenefitedFromCebas_basic: 'yearsBenefitedFromCebas_basic',
  scholarshipType_basic: 'scholarshipType_basic',
  institutionName_basic: 'institutionName_basic',
  institutionCNPJ_basic: 'institutionCNPJ_basic',
  benefitedFromCebasScholarship_professional: 'benefitedFromCebasScholarship_professional',
  lastYearBenefitedFromCebas_professional: 'lastYearBenefitedFromCebas_professional',
  scholarshipType_professional: 'scholarshipType_professional',
  institutionName_professional: 'institutionName_professional',
  institutionCNPJ_professional: 'institutionCNPJ_professional',
  nameOfScholarshipCourse_professional: 'nameOfScholarshipCourse_professional',
  candidate_id: 'candidate_id',
  responsible_id: 'responsible_id',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyMemberScalarFieldEnum = {
  id: 'id',
  relationship: 'relationship',
  otherRelationship: 'otherRelationship',
  main_id: 'main_id',
  fullName: 'fullName',
  socialName: 'socialName',
  birthDate: 'birthDate',
  gender: 'gender',
  nationality: 'nationality',
  natural_city: 'natural_city',
  natural_UF: 'natural_UF',
  CPF: 'CPF',
  RG: 'RG',
  rgIssuingAuthority: 'rgIssuingAuthority',
  rgIssuingState: 'rgIssuingState',
  documentType: 'documentType',
  documentNumber: 'documentNumber',
  documentValidity: 'documentValidity',
  numberOfBirthRegister: 'numberOfBirthRegister',
  bookOfBirthRegister: 'bookOfBirthRegister',
  pageOfBirthRegister: 'pageOfBirthRegister',
  maritalStatus: 'maritalStatus',
  skinColor: 'skinColor',
  religion: 'religion',
  educationLevel: 'educationLevel',
  specialNeeds: 'specialNeeds',
  specialNeedsDescription: 'specialNeedsDescription',
  specialNeedsType: 'specialNeedsType',
  hasMedicalReport: 'hasMedicalReport',
  landlinePhone: 'landlinePhone',
  workPhone: 'workPhone',
  contactNameForMessage: 'contactNameForMessage',
  email: 'email',
  profession: 'profession',
  enrolledGovernmentProgram: 'enrolledGovernmentProgram',
  NIS: 'NIS',
  educationPlace: 'educationPlace',
  institutionName: 'institutionName',
  coursingEducationLevel: 'coursingEducationLevel',
  cycleOfEducation: 'cycleOfEducation',
  turnOfEducation: 'turnOfEducation',
  hasScholarship: 'hasScholarship',
  percentageOfScholarship: 'percentageOfScholarship',
  monthlyAmount: 'monthlyAmount',
  candidate_id: 'candidate_id',
  attendedPublicHighSchool: 'attendedPublicHighSchool',
  benefitedFromCebasScholarship_basic: 'benefitedFromCebasScholarship_basic',
  benefitedFromCebasScholarship_professional: 'benefitedFromCebasScholarship_professional',
  CadUnico: 'CadUnico',
  hasSevereDeseaseOrUsesMedication: 'hasSevereDeseaseOrUsesMedication',
  hasBankAccount: 'hasBankAccount',
  isIncomeUpdated: 'isIncomeUpdated',
  incomeUpdatedStatus: 'incomeUpdatedStatus',
  incomeSource: 'incomeSource',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HousingScalarFieldEnum = {
  id: 'id',
  propertyStatus: 'propertyStatus',
  contractType: 'contractType',
  main_id: 'main_id',
  grantorName: 'grantorName',
  timeLivingInProperty: 'timeLivingInProperty',
  domicileType: 'domicileType',
  numberOfRooms: 'numberOfRooms',
  numberOfBedrooms: 'numberOfBedrooms',
  candidate_id: 'candidate_id',
  responsible_id: 'responsible_id',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  vehicleType: 'vehicleType',
  modelAndBrand: 'modelAndBrand',
  main_id: 'main_id',
  manufacturingYear: 'manufacturingYear',
  situation: 'situation',
  financedMonths: 'financedMonths',
  monthsToPayOff: 'monthsToPayOff',
  hasInsurance: 'hasInsurance',
  insuranceValue: 'insuranceValue',
  usage: 'usage',
  candidate_id: 'candidate_id',
  owners_id: 'owners_id',
  plate: 'plate',
  document: 'document',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyMemberIncomeScalarFieldEnum = {
  id: 'id',
  employmentType: 'employmentType',
  averageIncome: 'averageIncome',
  main_id: 'main_id',
  isUpdated: 'isUpdated',
  updatedStatus: 'updatedStatus',
  admissionDate: 'admissionDate',
  position: 'position',
  payingSource: 'payingSource',
  payingSourcePhone: 'payingSourcePhone',
  startDate: 'startDate',
  CNPJ: 'CNPJ',
  financialAssistantCPF: 'financialAssistantCPF',
  socialReason: 'socialReason',
  fantasyName: 'fantasyName',
  CPNJ: 'CPNJ',
  receivesUnemployment: 'receivesUnemployment',
  parcels: 'parcels',
  firstParcelDate: 'firstParcelDate',
  parcelValue: 'parcelValue',
  familyMember_id: 'familyMember_id',
  quantity: 'quantity',
  candidate_id: 'candidate_id',
  application_id: 'application_id',
  legalResponsibleId: 'legalResponsibleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MonthlyIncomeScalarFieldEnum = {
  id: 'id',
  receivedIncome: 'receivedIncome',
  analysisStatus: 'analysisStatus',
  date: 'date',
  main_id: 'main_id',
  grossAmount: 'grossAmount',
  liquidAmount: 'liquidAmount',
  proLabore: 'proLabore',
  dividends: 'dividends',
  total: 'total',
  deductionValue: 'deductionValue',
  publicPension: 'publicPension',
  incomeTax: 'incomeTax',
  otherDeductions: 'otherDeductions',
  foodAllowanceValue: 'foodAllowanceValue',
  transportAllowanceValue: 'transportAllowanceValue',
  expenseReimbursementValue: 'expenseReimbursementValue',
  advancePaymentValue: 'advancePaymentValue',
  reversalValue: 'reversalValue',
  compensationValue: 'compensationValue',
  judicialPensionValue: 'judicialPensionValue',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  incomeSource: 'incomeSource',
  application_id: 'application_id',
  legalResponsibleId: 'legalResponsibleId',
  income_id: 'income_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankAccountScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  bankName: 'bankName',
  agencyNumber: 'agencyNumber',
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  isUpdated: 'isUpdated',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankBalanceScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  initialBalance: 'initialBalance',
  outflowBalance: 'outflowBalance',
  entryBalance: 'entryBalance',
  totalBalance: 'totalBalance',
  date: 'date',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  bankAccount_id: 'bankAccount_id',
  application_id: 'application_id'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  date: 'date',
  waterSewage: 'waterSewage',
  electricity: 'electricity',
  landlinePhone: 'landlinePhone',
  mobilePhone: 'mobilePhone',
  food: 'food',
  rent: 'rent',
  garageRent: 'garageRent',
  condominium: 'condominium',
  cableTV: 'cableTV',
  streamingServices: 'streamingServices',
  fuel: 'fuel',
  annualIPVA: 'annualIPVA',
  annualIPTU: 'annualIPTU',
  annualITR: 'annualITR',
  annualIR: 'annualIR',
  INSS: 'INSS',
  publicTransport: 'publicTransport',
  schoolTransport: 'schoolTransport',
  internet: 'internet',
  courses: 'courses',
  healthPlan: 'healthPlan',
  dentalPlan: 'dentalPlan',
  medicationExpenses: 'medicationExpenses',
  totalExpense: 'totalExpense',
  candidate_id: 'candidate_id',
  installmentCountIPTU: 'installmentCountIPTU',
  installmentCountIPVA: 'installmentCountIPVA',
  installmentCountIR: 'installmentCountIR',
  installmentCountITR: 'installmentCountITR',
  installmentValueIPTU: 'installmentValueIPTU',
  installmentValueIPVA: 'installmentValueIPVA',
  installmentValueIR: 'installmentValueIR',
  installmentValueITR: 'installmentValueITR',
  financing: 'financing',
  creditCard: 'creditCard',
  optedForInstallmentIPTU: 'optedForInstallmentIPTU',
  optedForInstallmentIPVA: 'optedForInstallmentIPVA',
  optedForInstallmentIR: 'optedForInstallmentIR',
  optedForInstallmentITR: 'optedForInstallmentITR',
  justifywaterSewage: 'justifywaterSewage',
  justifyelectricity: 'justifyelectricity',
  justifylandlinePhone: 'justifylandlinePhone',
  justifyfood: 'justifyfood',
  justifyrent: 'justifyrent',
  justifycondominium: 'justifycondominium',
  justifycableTV: 'justifycableTV',
  justifystreamingServices: 'justifystreamingServices',
  justifyfuel: 'justifyfuel',
  justifyannualIPVA: 'justifyannualIPVA',
  justifyannualIPTU: 'justifyannualIPTU',
  justifyfinancing: 'justifyfinancing',
  justifyannualIR: 'justifyannualIR',
  justifyschoolTransport: 'justifyschoolTransport',
  justifycreditCard: 'justifycreditCard',
  justifyinternet: 'justifyinternet',
  justifycourses: 'justifycourses',
  justifyhealthPlan: 'justifyhealthPlan',
  justifymedicationExpenses: 'justifymedicationExpenses',
  otherExpensesDescription: 'otherExpensesDescription',
  otherExpensesValue: 'otherExpensesValue',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoanScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  familyMemberName: 'familyMemberName',
  installmentValue: 'installmentValue',
  totalInstallments: 'totalInstallments',
  paidInstallments: 'paidInstallments',
  bankName: 'bankName',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FinancingScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  familyMemberName: 'familyMemberName',
  installmentValue: 'installmentValue',
  totalInstallments: 'totalInstallments',
  paidInstallments: 'paidInstallments',
  bankName: 'bankName',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  otherFinancing: 'otherFinancing',
  financingType: 'financingType',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CreditCardScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  familyMemberName: 'familyMemberName',
  usersCount: 'usersCount',
  cardType: 'cardType',
  bankName: 'bankName',
  cardFlag: 'cardFlag',
  invoiceValue: 'invoiceValue',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OtherExpenseScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  description: 'description',
  value: 'value',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyMemberDiseaseScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  disease: 'disease',
  diseases: 'diseases',
  specificDisease: 'specificDisease',
  hasMedicalReport: 'hasMedicalReport',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MedicationScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  medicationName: 'medicationName',
  obtainedPublicly: 'obtainedPublicly',
  specificMedicationPublicly: 'specificMedicationPublicly',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  familyMemberDiseaseId: 'familyMemberDiseaseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeclarationsScalarFieldEnum = {
  id: 'id',
  declarationType: 'declarationType',
  text: 'text',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyMemberToVehicleScalarFieldEnum = {
  A: 'A',
  B: 'B',
  application_id: 'application_id',
  main_id: 'main_id'
};

exports.Prisma.CandidateDocumentsScalarFieldEnum = {
  id: 'id',
  status: 'status',
  path: 'path',
  pathInMainDatabase: 'pathInMainDatabase',
  metadata: 'metadata',
  tableName: 'tableName',
  tableId: 'tableId',
  analysisStatus: 'analysisStatus',
  AiData: 'AiData',
  tries: 'tries',
  memberId: 'memberId',
  application_id: 'application_id',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationMembersCNPJScalarFieldEnum = {
  id: 'id',
  CPFCNPJ: 'CPFCNPJ',
  InformedCNPJ: 'InformedCNPJ',
  member_id: 'member_id',
  application_id: 'application_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FoundApplicationCNPJScalarFieldEnum = {
  id: 'id',
  cnpj: 'cnpj',
  razao: 'razao',
  fantasia: 'fantasia',
  dataSociedade: 'dataSociedade',
  qualificacao: 'qualificacao',
  situacao: 'situacao',
  applicationMembersCNPJ_id: 'applicationMembersCNPJ_id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ROLE = exports.$Enums.ROLE = {
  ADMIN: 'ADMIN',
  CANDIDATE: 'CANDIDATE',
  RESPONSIBLE: 'RESPONSIBLE',
  ENTITY: 'ENTITY',
  ASSISTANT: 'ASSISTANT',
  ENTITY_SUB: 'ENTITY_SUB',
  ENTITY_DIRECTOR: 'ENTITY_DIRECTOR',
  SELECTION_RESPONSIBLE: 'SELECTION_RESPONSIBLE'
};

exports.INSTITUTION_TYPE = exports.$Enums.INSTITUTION_TYPE = {
  Public: 'Public',
  Private: 'Private'
};

exports.EDUCATION_TYPE = exports.$Enums.EDUCATION_TYPE = {
  Alfabetizacao: 'Alfabetizacao',
  Ensino_Medio: 'Ensino_Medio',
  Ensino_Tecnico: 'Ensino_Tecnico',
  Ensino_Superior: 'Ensino_Superior'
};

exports.SHIFT = exports.$Enums.SHIFT = {
  Matutino: 'Matutino',
  Vespertino: 'Vespertino',
  Noturno: 'Noturno',
  Integral: 'Integral'
};

exports.GENDER = exports.$Enums.GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

exports.COUNTRY = exports.$Enums.COUNTRY = {
  AC: 'AC',
  AL: 'AL',
  AM: 'AM',
  AP: 'AP',
  BA: 'BA',
  CE: 'CE',
  DF: 'DF',
  ES: 'ES',
  GO: 'GO',
  MA: 'MA',
  MG: 'MG',
  MS: 'MS',
  MT: 'MT',
  PA: 'PA',
  PB: 'PB',
  PE: 'PE',
  PI: 'PI',
  PR: 'PR',
  RJ: 'RJ',
  RN: 'RN',
  RO: 'RO',
  RR: 'RR',
  RS: 'RS',
  SC: 'SC',
  SE: 'SE',
  SP: 'SP',
  TO: 'TO'
};

exports.DOCUMENT_TYPE = exports.$Enums.DOCUMENT_TYPE = {
  DriversLicense: 'DriversLicense',
  FunctionalCard: 'FunctionalCard',
  MilitaryID: 'MilitaryID',
  Foreignerapplication: 'Foreignerapplication',
  Passport: 'Passport',
  WorkCard: 'WorkCard'
};

exports.DocumentAnalysisStatus = exports.$Enums.DocumentAnalysisStatus = {
  Pending: 'Pending',
  NotIncluded: 'NotIncluded',
  Approved: 'Approved',
  Declined: 'Declined',
  Forced: 'Forced',
  Failed: 'Failed'
};

exports.MARITAL_STATUS = exports.$Enums.MARITAL_STATUS = {
  Single: 'Single',
  Married: 'Married',
  Separated: 'Separated',
  Divorced: 'Divorced',
  Widowed: 'Widowed',
  StableUnion: 'StableUnion'
};

exports.SkinColor = exports.$Enums.SkinColor = {
  Yellow: 'Yellow',
  White: 'White',
  Indigenous: 'Indigenous',
  Brown: 'Brown',
  Black: 'Black',
  NotDeclared: 'NotDeclared'
};

exports.RELIGION = exports.$Enums.RELIGION = {
  Catholic: 'Catholic',
  Evangelical: 'Evangelical',
  Spiritist: 'Spiritist',
  Atheist: 'Atheist',
  Other: 'Other',
  NotDeclared: 'NotDeclared'
};

exports.SCHOLARSHIP = exports.$Enums.SCHOLARSHIP = {
  Illiterate: 'Illiterate',
  ElementarySchool: 'ElementarySchool',
  HighSchool: 'HighSchool',
  CollegeGraduate: 'CollegeGraduate',
  CollegeUndergraduate: 'CollegeUndergraduate',
  Postgraduate: 'Postgraduate',
  Masters: 'Masters',
  Doctorate: 'Doctorate',
  PostDoctorate: 'PostDoctorate'
};

exports.ScholarshipType = exports.$Enums.ScholarshipType = {
  integralScholarchip: 'integralScholarchip',
  halfScholarchip: 'halfScholarchip'
};

exports.IncomeSource = exports.$Enums.IncomeSource = {
  PrivateEmployee: 'PrivateEmployee',
  PublicEmployee: 'PublicEmployee',
  DomesticEmployee: 'DomesticEmployee',
  TemporaryRuralEmployee: 'TemporaryRuralEmployee',
  BusinessOwnerSimplifiedTax: 'BusinessOwnerSimplifiedTax',
  BusinessOwner: 'BusinessOwner',
  IndividualEntrepreneur: 'IndividualEntrepreneur',
  SelfEmployed: 'SelfEmployed',
  Retired: 'Retired',
  Pensioner: 'Pensioner',
  Apprentice: 'Apprentice',
  Volunteer: 'Volunteer',
  RentalIncome: 'RentalIncome',
  Student: 'Student',
  InformalWorker: 'InformalWorker',
  Unemployed: 'Unemployed',
  TemporaryDisabilityBenefit: 'TemporaryDisabilityBenefit',
  LiberalProfessional: 'LiberalProfessional',
  FinancialHelpFromOthers: 'FinancialHelpFromOthers',
  Alimony: 'Alimony',
  PrivatePension: 'PrivatePension',
  IncomeTransfer: 'IncomeTransfer'
};

exports.Relationship = exports.$Enums.Relationship = {
  Wife: 'Wife',
  Husband: 'Husband',
  Father: 'Father',
  Mother: 'Mother',
  Stepfather: 'Stepfather',
  Stepmother: 'Stepmother',
  Sibling: 'Sibling',
  Grandparent: 'Grandparent',
  Child: 'Child',
  Other: 'Other'
};

exports.PropertyStatus = exports.$Enums.PropertyStatus = {
  OwnPaidOff: 'OwnPaidOff',
  OwnFinanced: 'OwnFinanced',
  Rented: 'Rented',
  ProvidedByEmployer: 'ProvidedByEmployer',
  ProvidedByFamily: 'ProvidedByFamily',
  ProvidedOtherWay: 'ProvidedOtherWay',
  Irregular: 'Irregular'
};

exports.ContractType = exports.$Enums.ContractType = {
  Verbal: 'Verbal',
  ThroughRealEstateAgency: 'ThroughRealEstateAgency',
  DirectWithOwner: 'DirectWithOwner'
};

exports.TimeLivingInProperty = exports.$Enums.TimeLivingInProperty = {
  UpTo11Months: 'UpTo11Months',
  From1To10Years: 'From1To10Years',
  From10To20Years: 'From10To20Years',
  Over20Years: 'Over20Years'
};

exports.DomicileType = exports.$Enums.DomicileType = {
  House: 'House',
  CondominiumHouse: 'CondominiumHouse',
  Apartment: 'Apartment',
  RoomingHouse: 'RoomingHouse'
};

exports.NumberOfRooms = exports.$Enums.NumberOfRooms = {
  One: 'One',
  Two: 'Two',
  Three: 'Three',
  Four: 'Four',
  Five: 'Five',
  Six: 'Six',
  Seven: 'Seven',
  Eight: 'Eight',
  Nine: 'Nine',
  Ten: 'Ten',
  Eleven: 'Eleven',
  Twelve: 'Twelve'
};

exports.VehicleType = exports.$Enums.VehicleType = {
  SmallCarsAndUtilities: 'SmallCarsAndUtilities',
  TrucksAndMinibuses: 'TrucksAndMinibuses',
  Motorcycles: 'Motorcycles'
};

exports.VehicleSituation = exports.$Enums.VehicleSituation = {
  PaidOff: 'PaidOff',
  Financed: 'Financed'
};

exports.VehicleUsage = exports.$Enums.VehicleUsage = {
  WorkInstrument: 'WorkInstrument',
  NecessaryDisplacement: 'NecessaryDisplacement'
};

exports.EmploymentType = exports.$Enums.EmploymentType = {
  PrivateEmployee: 'PrivateEmployee',
  PublicEmployee: 'PublicEmployee',
  DomesticEmployee: 'DomesticEmployee',
  TemporaryRuralEmployee: 'TemporaryRuralEmployee',
  BusinessOwnerSimplifiedTax: 'BusinessOwnerSimplifiedTax',
  BusinessOwner: 'BusinessOwner',
  IndividualEntrepreneur: 'IndividualEntrepreneur',
  SelfEmployed: 'SelfEmployed',
  Retired: 'Retired',
  Pensioner: 'Pensioner',
  Apprentice: 'Apprentice',
  Volunteer: 'Volunteer',
  RentalIncome: 'RentalIncome',
  Student: 'Student',
  InformalWorker: 'InformalWorker',
  Unemployed: 'Unemployed',
  TemporaryDisabilityBenefit: 'TemporaryDisabilityBenefit',
  LiberalProfessional: 'LiberalProfessional',
  FinancialHelpFromOthers: 'FinancialHelpFromOthers',
  Alimony: 'Alimony',
  PrivatePension: 'PrivatePension',
  IncomeTransfer: 'IncomeTransfer'
};

exports.AccountType = exports.$Enums.AccountType = {
  CHECKING_ACCOUNT: 'CHECKING_ACCOUNT',
  SAVINGS_ACCOUNT: 'SAVINGS_ACCOUNT',
  PAYMENT_ACCOUNT: 'PAYMENT_ACCOUNT',
  SALARY_ACCOUNT: 'SALARY_ACCOUNT',
  STUDENT_ACCOUNT: 'STUDENT_ACCOUNT',
  DIGITAL_ACCOUNT: 'DIGITAL_ACCOUNT',
  MINORS_ACCOUNT: 'MINORS_ACCOUNT',
  BUSINESS_ACCOUNT: 'BUSINESS_ACCOUNT',
  JOINT_ACCOUNT: 'JOINT_ACCOUNT'
};

exports.FinancingType = exports.$Enums.FinancingType = {
  Car: 'Car',
  Motorcycle: 'Motorcycle',
  Truck: 'Truck',
  House_Apartment_Land: 'House_Apartment_Land',
  Other: 'Other'
};

exports.Disease = exports.$Enums.Disease = {
  ALIENATION_MENTAL: 'ALIENATION_MENTAL',
  CARDIOPATHY_SEVERE: 'CARDIOPATHY_SEVERE',
  BLINDNESS: 'BLINDNESS',
  RADIATION_CONTAMINATION: 'RADIATION_CONTAMINATION',
  PARKINSONS_DISEASE: 'PARKINSONS_DISEASE',
  ANKYLOSING_SPONDYLITIS: 'ANKYLOSING_SPONDYLITIS',
  PAGETS_DISEASE: 'PAGETS_DISEASE',
  HANSENS_DISEASE: 'HANSENS_DISEASE',
  SEVERE_HEPATOPATHY: 'SEVERE_HEPATOPATHY',
  SEVERE_NEPHROPATHY: 'SEVERE_NEPHROPATHY',
  PARALYSIS: 'PARALYSIS',
  ACTIVE_TUBERCULOSIS: 'ACTIVE_TUBERCULOSIS',
  HIV_AIDS: 'HIV_AIDS',
  MALIGNANT_NEOPLASM: 'MALIGNANT_NEOPLASM',
  TERMINAL_STAGE: 'TERMINAL_STAGE',
  MICROCEPHALY: 'MICROCEPHALY',
  AUTISM_SPECTRUM_DISORDER: 'AUTISM_SPECTRUM_DISORDER',
  RARE_DISEASE: 'RARE_DISEASE',
  OTHER_HIGH_COST_DISEASE: 'OTHER_HIGH_COST_DISEASE'
};

exports.Declaration_Type = exports.$Enums.Declaration_Type = {
  Form: 'Form',
  Activity: 'Activity',
  AddressProof: 'AddressProof',
  Autonomo: 'Autonomo',
  Card: 'Card',
  ChildPension: 'ChildPension',
  ChildSupport: 'ChildSupport',
  ContributionStatement: 'ContributionStatement',
  Data: 'Data',
  Empresario: 'Empresario',
  InactiveCompany: 'InactiveCompany',
  IncomeTaxExemption: 'IncomeTaxExemption',
  MEI: 'MEI',
  NoAddressProof: 'NoAddressProof',
  Penseion: 'Penseion',
  Pension: 'Pension',
  Rent: 'Rent',
  RentDetails: 'RentDetails',
  RentIncome: 'RentIncome',
  RentedHouse: 'RentedHouse',
  RuralWorker: 'RuralWorker',
  SingleStatus: 'SingleStatus',
  StableUnion: 'StableUnion',
  Status: 'Status',
  WorkCard: 'WorkCard'
};

exports.CandidateDocumentStatus = exports.$Enums.CandidateDocumentStatus = {
  UPDATED: 'UPDATED',
  PENDING: 'PENDING'
};

exports.Prisma.ModelName = {
  IdMapping: 'IdMapping',
  Candidate: 'Candidate',
  User: 'User',
  LegalResponsible: 'LegalResponsible',
  IdentityDetails: 'IdentityDetails',
  FamilyMember: 'FamilyMember',
  Housing: 'Housing',
  Vehicle: 'Vehicle',
  FamilyMemberIncome: 'FamilyMemberIncome',
  MonthlyIncome: 'MonthlyIncome',
  BankAccount: 'BankAccount',
  BankBalance: 'BankBalance',
  Expense: 'Expense',
  Loan: 'Loan',
  Financing: 'Financing',
  CreditCard: 'CreditCard',
  OtherExpense: 'OtherExpense',
  FamilyMemberDisease: 'FamilyMemberDisease',
  Medication: 'Medication',
  Declarations: 'Declarations',
  FamilyMemberToVehicle: 'FamilyMemberToVehicle',
  CandidateDocuments: 'CandidateDocuments',
  ApplicationMembersCNPJ: 'ApplicationMembersCNPJ',
  FoundApplicationCNPJ: 'FoundApplicationCNPJ'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://github.com/prisma/prisma/issues`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
