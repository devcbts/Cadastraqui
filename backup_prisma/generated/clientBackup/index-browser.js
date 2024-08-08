
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
  application_id: 'application_id'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  profilePicture: 'profilePicture'
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
  application_id: 'application_id'
};

exports.Prisma.SocialAssistantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  CPF: 'CPF',
  RG: 'RG',
  CRESS: 'CRESS',
  phone: 'phone',
  user_id: 'user_id',
  entity_id: 'entity_id'
};

exports.Prisma.EntityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  socialReason: 'socialReason',
  logo: 'logo',
  CNPJ: 'CNPJ',
  CEP: 'CEP',
  address: 'address',
  addressNumber: 'addressNumber',
  neighborhood: 'neighborhood',
  UF: 'UF',
  city: 'city',
  educationalInstitutionCode: 'educationalInstitutionCode',
  user_id: 'user_id'
};

exports.Prisma.EntitySubsidiaryScalarFieldEnum = {
  id: 'id',
  CNPJ: 'CNPJ',
  name: 'name',
  socialReason: 'socialReason',
  CEP: 'CEP',
  address: 'address',
  addressNumber: 'addressNumber',
  city: 'city',
  neighborhood: 'neighborhood',
  UF: 'UF',
  educationalInstitutionCode: 'educationalInstitutionCode',
  entity_id: 'entity_id',
  user_id: 'user_id'
};

exports.Prisma.EntityDirectorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  CPF: 'CPF',
  phone: 'phone',
  user_id: 'user_id',
  entity_subsidiary_id: 'entity_subsidiary_id',
  entity_id: 'entity_id'
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
  application_id: 'application_id'
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
  incomeSource: 'incomeSource',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id'
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
  application_id: 'application_id'
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
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id'
};

exports.Prisma.FamilyMemberIncomeScalarFieldEnum = {
  id: 'id',
  employmentType: 'employmentType',
  averageIncome: 'averageIncome',
  main_id: 'main_id',
  isUpdated: 'isUpdated',
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
  legalResponsibleId: 'legalResponsibleId'
};

exports.Prisma.MonthlyIncomeScalarFieldEnum = {
  id: 'id',
  receivedIncome: 'receivedIncome',
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
  legalResponsibleId: 'legalResponsibleId'
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
  application_id: 'application_id'
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
  application_id: 'application_id'
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
  application_id: 'application_id'
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
  application_id: 'application_id'
};

exports.Prisma.OtherExpenseScalarFieldEnum = {
  id: 'id',
  main_id: 'main_id',
  description: 'description',
  value: 'value',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id'
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
  application_id: 'application_id'
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
  familyMemberDiseaseId: 'familyMemberDiseaseId'
};

exports.Prisma.DeclarationsScalarFieldEnum = {
  id: 'id',
  declarationType: 'declarationType',
  text: 'text',
  familyMember_id: 'familyMember_id',
  candidate_id: 'candidate_id',
  legalResponsibleId: 'legalResponsibleId',
  application_id: 'application_id'
};

exports.Prisma.AnnouncementInterviewScalarFieldEnum = {
  startDate: 'startDate',
  endDate: 'endDate',
  beginHour: 'beginHour',
  interval: 'interval',
  endHour: 'endHour',
  duration: 'duration',
  announcement_id: 'announcement_id'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  entityChanged: 'entityChanged',
  branchChanged: 'branchChanged',
  announcementType: 'announcementType',
  announcementNumber: 'announcementNumber',
  announcementDate: 'announcementDate',
  announcementBegin: 'announcementBegin',
  openDate: 'openDate',
  closeDate: 'closeDate',
  waitingList: 'waitingList',
  offeredVacancies: 'offeredVacancies',
  verifiedScholarships: 'verifiedScholarships',
  description: 'description',
  entity_id: 'entity_id',
  announcementName: 'announcementName',
  announcementLogo: 'announcementLogo',
  type2: 'type2',
  criteria: 'criteria',
  types1: 'types1'
};

exports.Prisma.TimelineScalarFieldEnum = {
  id: 'id',
  controlLine: 'controlLine',
  stage: 'stage',
  deadline: 'deadline',
  announcementId: 'announcementId'
};

exports.Prisma.EducationLevelScalarFieldEnum = {
  id: 'id',
  level: 'level',
  basicEduType: 'basicEduType',
  scholarshipType: 'scholarshipType',
  higherEduScholarshipType: 'higherEduScholarshipType',
  offeredCourseType: 'offeredCourseType',
  availableCourses: 'availableCourses',
  offeredVacancies: 'offeredVacancies',
  verifiedScholarships: 'verifiedScholarships',
  shift: 'shift',
  semester: 'semester',
  grade: 'grade',
  announcementId: 'announcementId',
  entitySubsidiaryId: 'entitySubsidiaryId'
};

exports.Prisma.ApplicationScalarFieldEnum = {
  id: 'id',
  candidate_id: 'candidate_id',
  announcement_id: 'announcement_id',
  status: 'status',
  socialAssistant_id: 'socialAssistant_id',
  educationLevel_id: 'educationLevel_id',
  candidateName: 'candidateName',
  SocialAssistantName: 'SocialAssistantName',
  CadUnico: 'CadUnico',
  hasSevereDesease: 'hasSevereDesease',
  averageIncome: 'averageIncome',
  perCapita: 'perCapita',
  position: 'position',
  number: 'number',
  createdAt: 'createdAt',
  reponsible_id: 'reponsible_id'
};

exports.Prisma.ApplicationHistoryScalarFieldEnum = {
  id: 'id',
  application_id: 'application_id',
  description: 'description',
  solicitation: 'solicitation',
  report: 'report',
  answered: 'answered',
  deadLine: 'deadLine',
  date: 'date'
};

exports.Prisma.ScholarshipGrantedScalarFieldEnum = {
  id: 'id',
  gaveUp: 'gaveUp',
  ScholarshipCode: 'ScholarshipCode',
  types: 'types',
  application_id: 'application_id',
  announcement_id: 'announcement_id'
};

exports.Prisma.FamilyMemberToVehicleScalarFieldEnum = {
  A: 'A',
  B: 'B',
  application_id: 'application_id',
  main_id: 'main_id'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
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

exports.GENDER = exports.$Enums.GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

exports.DOCUMENT_TYPE = exports.$Enums.DOCUMENT_TYPE = {
  DriversLicense: 'DriversLicense',
  FunctionalCard: 'FunctionalCard',
  MilitaryID: 'MilitaryID',
  Foreignerapplication: 'Foreignerapplication',
  Passport: 'Passport',
  WorkCard: 'WorkCard'
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
  PrivatePension: 'PrivatePension'
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
  PrivatePension: 'PrivatePension'
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

exports.AnnouncementType = exports.$Enums.AnnouncementType = {
  ScholarshipGrant: 'ScholarshipGrant',
  PeriodicVerification: 'PeriodicVerification'
};

exports.TiebreakerCriterias = exports.$Enums.TiebreakerCriterias = {
  CadUnico: 'CadUnico',
  LeastFamilyIncome: 'LeastFamilyIncome',
  SeriousIllness: 'SeriousIllness',
  Draw: 'Draw'
};

exports.scholarshipGrantedType = exports.$Enums.scholarshipGrantedType = {
  UNIFORM: 'UNIFORM',
  TRANSPORT: 'TRANSPORT',
  FOOD: 'FOOD',
  HOUSING: 'HOUSING',
  STUDY_MATERIAL: 'STUDY_MATERIAL'
};

exports.LevelType = exports.$Enums.LevelType = {
  BasicEducation: 'BasicEducation',
  HigherEducation: 'HigherEducation'
};

exports.BasicEducationType = exports.$Enums.BasicEducationType = {
  Preschool: 'Preschool',
  Elementary: 'Elementary',
  HighSchool: 'HighSchool',
  ProfessionalEducation: 'ProfessionalEducation'
};

exports.ScholarshipOfferType = exports.$Enums.ScholarshipOfferType = {
  Law187ScholarshipPartial: 'Law187ScholarshipPartial',
  Law187Scholarship: 'Law187Scholarship',
  StudentWithDisabilityPartial: 'StudentWithDisabilityPartial',
  StudentWithDisability: 'StudentWithDisability',
  FullTimePartial: 'FullTimePartial',
  FullTime: 'FullTime',
  EntityWorkersPartial: 'EntityWorkersPartial',
  EntityWorkers: 'EntityWorkers'
};

exports.HigherEducationScholarshipType = exports.$Enums.HigherEducationScholarshipType = {
  PROUNIFull: 'PROUNIFull',
  PROUNIPartial: 'PROUNIPartial',
  StateGovernment: 'StateGovernment',
  StateGovernmentPartial: 'StateGovernmentPartial',
  CityGovernment: 'CityGovernment',
  CityGovernmentPartial: 'CityGovernmentPartial',
  ExternalEntities: 'ExternalEntities',
  ExternalEntitiesPartial: 'ExternalEntitiesPartial',
  HigherEduInstitutionFull: 'HigherEduInstitutionFull',
  HigherEduInstitutionPartial: 'HigherEduInstitutionPartial',
  HigherEduInstitutionWorkers: 'HigherEduInstitutionWorkers',
  HigherEduInstitutionWorkersPartial: 'HigherEduInstitutionWorkersPartial',
  PostgraduateStrictoSensu: 'PostgraduateStrictoSensu',
  PostgraduateStrictoSensuPartial: 'PostgraduateStrictoSensuPartial'
};

exports.OfferedCourseType = exports.$Enums.OfferedCourseType = {
  UndergraduateBachelor: 'UndergraduateBachelor',
  UndergraduateLicense: 'UndergraduateLicense',
  UndergraduateTechnologist: 'UndergraduateTechnologist',
  Postgraduate: 'Postgraduate'
};

exports.ApplicationStatus = exports.$Enums.ApplicationStatus = {
  Approved: 'Approved',
  Rejected: 'Rejected',
  Pending: 'Pending',
  WaitingList: 'WaitingList'
};

exports.SolicitationType = exports.$Enums.SolicitationType = {
  Document: 'Document',
  Interview: 'Interview',
  Visit: 'Visit'
};

exports.Prisma.ModelName = {
  IdMapping: 'IdMapping',
  Candidate: 'Candidate',
  User: 'User',
  LegalResponsible: 'LegalResponsible',
  SocialAssistant: 'SocialAssistant',
  Entity: 'Entity',
  EntitySubsidiary: 'EntitySubsidiary',
  EntityDirector: 'EntityDirector',
  IdentityDetails: 'IdentityDetails',
  FamilyMember: 'FamilyMember',
  Housing: 'Housing',
  Vehicle: 'Vehicle',
  FamilyMemberIncome: 'FamilyMemberIncome',
  MonthlyIncome: 'MonthlyIncome',
  BankAccount: 'BankAccount',
  Expense: 'Expense',
  Loan: 'Loan',
  Financing: 'Financing',
  CreditCard: 'CreditCard',
  OtherExpense: 'OtherExpense',
  FamilyMemberDisease: 'FamilyMemberDisease',
  Medication: 'Medication',
  Declarations: 'Declarations',
  AnnouncementInterview: 'AnnouncementInterview',
  Announcement: 'Announcement',
  Timeline: 'Timeline',
  EducationLevel: 'EducationLevel',
  Application: 'Application',
  ApplicationHistory: 'ApplicationHistory',
  ScholarshipGranted: 'ScholarshipGranted',
  FamilyMemberToVehicle: 'FamilyMemberToVehicle'
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
