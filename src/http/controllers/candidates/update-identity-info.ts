import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ScholarshipType } from './enums/Scholaship_Type'

export async function updateIdentityInfo(
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
    gender: z.union([GENDER, z.null()]),
    nationality: z.string().optional(),
    natural_city: z.string().optional(),
    natural_UF: z.union([COUNTRY, z.null()]),
    RG: z.string().optional(),
    rgIssuingAuthority: z.string().optional(),
    rgIssuingState: z.string().optional(),
    documentType: z.union([DOCUMENT_TYPE, z.null()]),
    documentNumber: z.union([z.string(), z.null()]),
    documentValidity: z.union([z.string(), z.null()]),
    numberOfBirthRegister: z.string().optional(),
    bookOfBirthRegister: z.string().optional(),
    pageOfBirthRegister: z.string().optional(),
    maritalStatus: z.union([MARITAL_STATUS, z.null()]),
    skinColor: z.union([SkinColor, z.null()]),
    religion: z.union([RELIGION, z.null()]),
    educationLevel: z.union([SCHOLARSHIP, z.null()]),
    specialNeeds: z.union([z.boolean(), z.null()]),
    specialNeedsDescription: z.union([z.string(), z.null()]),
    specialNeedsType: z.union([z.string(), z.null()]),
    landlinePhone: z.union([z.string(), z.null()]),
    workPhone: z.union([z.string(), z.null()]),
    contactNameForMessage: z.union([z.string(), z.null()]),
    profession: z.string().optional(),
    enrolledGovernmentProgram: z.union([z.string(), z.null()]),
    NIS: z.union([z.string(), z.null()]),
    incomeSource: z.array(IncomeSource).optional(),
    livesAlone: z.boolean().optional(),
    intendsToGetScholarship: z.boolean().optional(),
    attendedPublicHighSchool: z.union([z.boolean(), z.null()]),
    benefitedFromCebasScholarship_basic: z.union([z.boolean(), z.null()]),
    yearsBenefitedFromCebas_basic: z.array(z.string()).optional(), // Certifique-se de que isso está correto
    scholarshipType_basic: z.union([ScholarshipType, z.null()]),
    institutionName_basic: z.union([z.string(), z.null()]),
    institutionCNPJ_basic: z.union([z.string(), z.null()]),
    benefitedFromCebasScholarship_professional: z.union([
      z.boolean(),
      z.null(),
    ]),
    lastYearBenefitedFromCebas_professional: z.union([
      z.string(),
      z.null(),
    ]),
    scholarshipType_professional: z.union([ScholarshipType, z.null()]),
    institutionName_professional: z.union([z.string(), z.null()]),
    institutionCNPJ_professional: z.union([z.string(), z.null()]),
    nameOfScholarshipCourse_professional: z.union([z.string(), z.null()]),
    CadUnico: z.boolean(),
    CPF: z.string(),
    CEP: z.string().nullish(),
    address: z.string().nullish(),
    addressNumber: z.string().nullish(),
    neighborhood: z.string().nullish(),
    city: z.string().nullish(),
    UF: z.string().nullish(),
    email: z.string().email(),
    complement: z.string().nullish(),
    hasSevereDeseaseOrUsesMedication: z.boolean().nullish(),
    hasBankAccount: z.boolean().nullish(),
    hasMedicalReport: z.boolean().nullish(),

  }).partial()

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
    CadUnico,
    CPF,
    CEP,
    address,
    addressNumber,
    neighborhood,
    city,
    UF,
    email,
    complement,
    hasSevereDeseaseOrUsesMedication,
    hasBankAccount,
    hasMedicalReport,
    specialNeedsType

  } = userDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    if (!user_id) {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({ where: { user_id } })

    const responsible = await prisma.legalResponsible.findUnique({
      where: { user_id }
    })

    if (!candidate && !responsible) {
      throw new ResourceNotFoundError()
    }
    const parsedData = {
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
        : null,
      enrolledGovernmentProgram,
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
      specialNeedsType,
      workPhone,
      yearsBenefitedFromCebas_basic,
      CadUnico,
      CPF,
      CEP,
      UF,
      city,
      address,
      addressNumber,
      neighborhood,
      email,
      complement,
      hasSevereDeseaseOrUsesMedication,
      hasBankAccount,
      hasMedicalReport

    }
    if (await prisma.identityDetails.findFirst({
      where: { CPF  }
    })) {
      throw new Error('CPF já cadastrado no sistema')
    } 
    if (await prisma.identityDetails.findFirst({
      where: { RG }
    })) {
      throw new Error('RG já cadastrado no sistema')
      
    }
    if (candidate) {

      const candidateIdentifyInfo = await prisma.identityDetails.findUnique({
        where: { candidate_id: candidate.id },
      })
      // Analisa se o candidato não possui cadastro de identificação
      if (!candidateIdentifyInfo) {
        throw new ResourceNotFoundError()
      }
    }

    const dataToUpdate: Record<string, any> = {}

    for (const key in parsedData) {
      const value = parsedData[key as keyof typeof parsedData]
      if (value !== null && value !== null) {
        dataToUpdate[key as keyof typeof parsedData] = value
      }
    }
    console.log(dataToUpdate)
    // Atualiza informações acerca da identificação no banco de dados
    if (candidate) {

      await prisma.identityDetails.update({
        data: dataToUpdate,
        where: { candidate_id: candidate.id },
      })
    }
    if (responsible) {
      await prisma.identityDetails.update({
        data: dataToUpdate,
        where: { responsible_id: responsible.id },
      })
    }
    console.log(parsedData)
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ForbiddenError()
    }
    const idFieldRegistration = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    await prisma.finishedRegistration.upsert({
      where: idFieldRegistration,

      create: { cadastrante: true, ...idFieldRegistration },
      update: { cadastrante: true },
    })
    return reply.status(201).send()
  } catch (err: any) {
    console.log(err)
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })

    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof Error) {
      return reply.status(412).send({ message: err.message })
    }
    return reply.status(500).send({ message: err.message })
  }
}
