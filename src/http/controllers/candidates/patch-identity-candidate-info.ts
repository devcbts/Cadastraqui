import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function patchIdentityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const GENDER = z.enum(['MALE', 'FEMALE'])
  const COUNTRY = z.enum([
    'AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MG',
    'MS',
    'MT',
    'PA',
    'PB',
    'PE',
    'PI',
    'PR',
    'RJ',
    'RN',
    'RO',
    'RR',
    'RS',
    'SC',
    'SE',
    'SP',
    'TO',
  ])
  const DOCUMENT_TYPE = z.enum([
    'DriversLicense',
    'FunctionalCard',
    'MilitaryID',
    'ForeignerRegistration',
    'Passport',
    'WorkCard',
  ])
  const MARITAL_STATUS = z.enum([
    'Single',
    'Married',
    'Separated',
    'Divorced',
    'Widowed',
    'StableUnion',
  ])
  const SkinColor = z.enum([
    'Yellow',
    'White',
    'Indigenous',
    'Brown',
    'Black',
    'NotDeclared',
  ])
  const RELIGION = z.enum([
    'Catholic',
    'Evangelical',
    'Spiritist',
    'Atheist',
    'Other',
    'NotDeclared',
  ])
  const SCHOLARSHIP = z.enum([
    'Illiterate',
    'ElementarySchool',
    'HighSchool',
    'CollegeGraduate',
    'CollegeUndergraduate',
    'Postgraduate',
    'Masters',
    'Doctorate',
    'PostDoctorate',
  ])
  const ScholarshipType = z.enum(['integralScholarchip', 'halfScholarchip'])
  const IncomeSource = z.enum([
    'PrivateEmployee',
    'PublicEmployee',
    'DomesticEmployee',
    'TemporaryRuralEmployee',
    'BusinessOwnerSimplifiedTax',
    'BusinessOwner',
    'IndividualEntrepreneur',
    'SelfEmployed',
    'Retired',
    'Pensioner',
    'Apprentice',
    'Volunteer',
    'RentalIncome',
    'Student',
    'InformalWorker',
    'Unemployed',
    'TemporaryDisabilityBenefit',
    'LiberalProfessional',
    'FinancialHelpFromOthers',
    'Alimony',
    'PrivatePension',
  ])

  const userDataSchema = z.object({
    fullName: z.string().optional(),
    socialName: z.string().optional(),
    gender: z.union([GENDER,z.undefined()]),
    nationality: z.string().optional(),
    natural_city: z.string().optional(),
    natural_UF: z.union([COUNTRY,z.undefined()]),
    RG: z.string().optional(),
    rgIssuingAuthority: z.string().optional(),
    rgIssuingState: z.string().optional(),
    documentType: z.union([DOCUMENT_TYPE, z.undefined()]),
    documentNumber: z.union([z.string(), z.undefined()]),
    documentValidity: z.union([z.string(), z.undefined()]),
    numberOfBirthRegister: z.string().optional(),
    bookOfBirthRegister: z.string().optional(),
    pageOfBirthRegister: z.string().optional(),
    maritalStatus: z.union([MARITAL_STATUS,z.undefined()]),
    skinColor: z.union([SkinColor,z.undefined()]),
    religion: z.union([RELIGION,z.undefined()]),
    educationLevel: z.union([SCHOLARSHIP,z.undefined()]),
    specialNeeds: z.union([z.boolean(), z.undefined()]),
    specialNeedsDescription: z.union([z.string(), z.undefined()]),
    hasMedicalReport: z.union([z.boolean(), z.undefined()]),
    landlinePhone: z.union([z.string(), z.undefined()]),
    workPhone: z.union([z.string(), z.undefined()]),
    contactNameForMessage: z.union([z.string(), z.undefined()]),
    profession: z.string().optional(),
    enrolledGovernmentProgram: z.union([z.boolean(), z.undefined()]),
    NIS: z.union([z.string(), z.undefined()]),
    incomeSource: z.array(IncomeSource).optional(),
    livesAlone: z.boolean().optional(),
    intendsToGetScholarship: z.boolean().optional(),
    attendedPublicHighSchool: z.union([z.boolean(), z.undefined()]),
    benefitedFromCebasScholarship_basic: z.union([z.boolean(), z.undefined()]),
    yearsBenefitedFromCebas_basic: z.array(z.string()).optional(), // Certifique-se de que isso está correto
    scholarshipType_basic: z.union([ScholarshipType, z.undefined()]),
    institutionName_basic: z.union([z.string(), z.undefined()]),
    institutionCNPJ_basic: z.union([z.string(), z.undefined()]),
    benefitedFromCebasScholarship_professional: z.union([
      z.boolean(),
      z.undefined(),
    ]),
    lastYearBenefitedFromCebas_professional: z.union([
      z.string(),
      z.undefined(),
    ]),
    scholarshipType_professional: z.union([ScholarshipType, z.undefined()]),
    institutionName_professional: z.union([z.string(), z.undefined()]),
    institutionCNPJ_professional: z.union([z.string(), z.undefined()]),
    nameOfScholarshipCourse_professional: z.union([z.string(), z.undefined()]),
  })

  const {
    fullName,
    socialName,
    gender,
    nationality,
    natural_UF,
    natural_city,
    RG,
    rgIssuingAuthority,
    rgIssuingState,
    documentType,
    documentNumber,
    documentValidity,
    maritalStatus,
    skinColor,
    religion,
    educationLevel,
    specialNeeds,
    specialNeedsDescription,
    hasMedicalReport,
    landlinePhone,
    workPhone,
    contactNameForMessage,
    profession,
    enrolledGovernmentProgram,
    NIS,
    incomeSource,
    livesAlone,
    intendsToGetScholarship,
    attendedPublicHighSchool,
    benefitedFromCebasScholarship_basic,
    yearsBenefitedFromCebas_basic,
    scholarshipType_basic,
    institutionName_basic,
    institutionCNPJ_basic,
    benefitedFromCebasScholarship_professional,
    lastYearBenefitedFromCebas_professional,
    scholarshipType_professional,
    institutionName_professional,
    institutionCNPJ_professional,
    nameOfScholarshipCourse_professional,
  } = userDataSchema.parse(request.body)

  

  try {
    const user_id = request.user.sub

    if (!user_id) {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    // Se o candidato não existir
    if (!candidate) {
      throw new ResourceNotFoundError()
    }


    const parsedData = {
      birthDate: candidate.birthDate,
      educationLevel,
      fullName,
      gender,
      intendsToGetScholarship,
      livesAlone,
      maritalStatus,
      nationality,
      natural_city,
      natural_UF,
      profession,
      religion,
      RG,
      rgIssuingAuthority,
      rgIssuingState,
      skinColor,
      socialName,
      attendedPublicHighSchool,
      benefitedFromCebasScholarship_basic,
      benefitedFromCebasScholarship_professional,
      contactNameForMessage,
      documentNumber,
      documentType,
      documentValidity: documentValidity
        ? new Date(documentValidity)
        : undefined,
      enrolledGovernmentProgram,
      hasMedicalReport,
      incomeSource,
      institutionCNPJ_basic,
      institutionCNPJ_professional,
      institutionName_basic,
      institutionName_professional,
      landlinePhone,
      lastYearBenefitedFromCebas_professional,
      nameOfScholarshipCourse_professional,
      NIS,
      scholarshipType_basic,
      scholarshipType_professional,
      specialNeeds,
      specialNeedsDescription,
      workPhone,
      yearsBenefitedFromCebas_basic,
    }


    const candidateIdentifyInfo = await prisma.identityDetails.findUnique({
      where: { candidate_id: candidate.id },
    })
    // Analisa se o candidato não possui cadastro de identificação
    if (!candidateIdentifyInfo) {
      throw new NotAllowedError()
    }

    const dataToUpdate: Record<string,any> = {};

    for (const key in parsedData) {
      const value = parsedData[key as keyof typeof parsedData];
      if (value !== undefined && value !== null) {
        dataToUpdate[key as keyof typeof parsedData] = value;
      }
    }

    // Atualiza informações acerca da identificação no banco de dados
    await prisma.identityDetails.update({
      data: dataToUpdate,
      where: {candidate_id: candidate.id}
    })

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
