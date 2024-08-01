import { AlreadyExistsError } from '@/errors/already-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import STATES from '@/utils/enums/zod/state'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { DOCUMENT_TYPE } from './enums/Document_Type'
import { GENDER } from './enums/Gender'
import IncomeSource from './enums/IncomeSource'
import { MARITAL_STATUS } from './enums/Marital_Status'
import { RELIGION } from './enums/Religion'
import { SCHOLARSHIP } from './enums/Scholarship'
import { ScholarshipType } from './enums/Scholaship_Type'
import { SkinColor } from './enums/SkinColor'

export async function registerIdentityInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  const userDataSchema = z.object({
    fullName: z.string(),
    socialName: z.string(),
    gender: GENDER,
    nationality: z.string(),
    natural_city: z.string(),
    natural_UF: STATES,
    RG: z.string(),
    rgIssuingAuthority: z.string(),
    rgIssuingState: z.string(),
    documentType: z.union([DOCUMENT_TYPE, z.undefined(), z.null()]).nullable(),
    documentNumber: z.union([z.string(), z.undefined(), z.null()]),
    documentValidity: z.union([z.string(), z.undefined(), z.null()]),
    numberOfBirthRegister: z.string().nullish(),
    bookOfBirthRegister: z.string().nullish(),
    pageOfBirthRegister: z.string().nullish(),
    maritalStatus: MARITAL_STATUS,
    skinColor: SkinColor,
    religion: RELIGION,
    educationLevel: SCHOLARSHIP,
    hasMedicalReport: z.boolean().default(false),
    specialNeeds: z.union([z.boolean(), z.undefined(), z.null()]),
    specialNeedsDescription: z.union([z.string(), z.undefined(), z.null()]),
    specialNeedsType: z.union([z.string(), z.undefined(), z.null()]),
    landlinePhone: z.union([z.string(), z.undefined(), z.null()]),
    workPhone: z.union([z.string(), z.undefined(), z.null()]),
    contactNameForMessage: z.union([z.string(), z.undefined(), z.null()]),
    profession: z.string(),
    enrolledGovernmentProgram: z.union([z.string(), z.undefined(), z.null()]),
    NIS: z.union([z.string(), z.undefined(), z.null()]),
    incomeSource: z.array(IncomeSource).default([]),
    livesAlone: z.boolean().default(false),
    intendsToGetScholarship: z.boolean().default(false),
    attendedPublicHighSchool: z.union([z.boolean(), z.undefined(), z.null()]),
    benefitedFromCebasScholarship_basic: z.union([z.boolean(), z.undefined(), z.null()]),
    yearsBenefitedFromCebas_basic: z.array(z.string()).default([]).nullable(), // Certifique-se de que isso está correto
    scholarshipType_basic: z.union([ScholarshipType, z.undefined(), z.null()]),
    institutionName_basic: z.union([z.string(), z.undefined(), z.null()]),
    institutionCNPJ_basic: z.union([z.string(), z.undefined(), z.null()]),
    benefitedFromCebasScholarship_professional: z.union([
      z.boolean(),
      z.undefined(), z.null(),
    ]),
    lastYearBenefitedFromCebas_professional: z.union([
      z.string(),
      z.undefined(), z.null(),
    ]),
    scholarshipType_professional: z.union([ScholarshipType, z.undefined(), z.null()]),
    institutionName_professional: z.union([z.string(), z.undefined(), z.null()]),
    institutionCNPJ_professional: z.union([z.string(), z.undefined(), z.null()]),
    nameOfScholarshipCourse_professional: z.union([z.string(), z.undefined(), z.null()]),
    CadUnico: z.boolean(),
    email: z.string(),
    complement: z.string().nullish(),
    address: z.string().nullish(),
    addressNumber: z.string().nullish(),
    CEP: z.string().nullish(),
    UF: STATES,
    neighborhood: z.string().nullish(),
    city: z.string().nullish(),
    hasSevereDeseaseOrUsesMedication: z.boolean().nullish(),
    hasBankAccount: z.boolean().nullish(),
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
    email,
    complement,
    CEP,
    address,
    addressNumber,
    UF,
    city,
    neighborhood,
    hasSevereDeseaseOrUsesMedication,
    hasBankAccount,
    hasMedicalReport,
    specialNeedsType

  } = userDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub


    // Verifica se existe um candidato associado ao user_id
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)

    if (!candidateOrResponsible) {
      throw new ResourceNotFoundError()
    }

    const idField = candidateOrResponsible.IsResponsible ? { responsible_id: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    // Analisa se o candidato já possui cadastro de identificação
    const candidateIdentifyInfo = await prisma.identityDetails.findUnique({
      where: idField,
    })
    if (candidateIdentifyInfo) {
      throw new AlreadyExistsError()
    }
    if (await prisma.identityDetails.findFirst({
      where: { CPF : candidateOrResponsible.UserData.CPF }
    })) {
      throw new Error('CPF já cadastrado no sistema')
    } 
    if (await prisma.identityDetails.findFirst({
      where: { RG }
    })) {
      throw new Error('RG já cadastrado no sistema')
      
    }

    // Armazena informações acerca da identificação no banco de dados
    const { id } = await prisma.identityDetails.create({
      data: {
        birthDate: candidateOrResponsible.UserData.birthDate,
        educationLevel,
        fullName,
        gender,
        intendsToGetScholarship: true,
        livesAlone: false,
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
        email: email,
        documentValidity: documentValidity
          ? new Date(documentValidity)
          : undefined,
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
        yearsBenefitedFromCebas_basic: [],
        ...idField,
        CadUnico,
        address,
        addressNumber,
        neighborhood,
        CPF: candidateOrResponsible.UserData.CPF,
        city,
        UF,
        CEP,
        complement,
        hasBankAccount,
        hasSevereDeseaseOrUsesMedication,
        hasMedicalReport
      },
    })
    const idFieldRegistration = candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id }
    await prisma.finishedRegistration.upsert({
      where: idFieldRegistration,
      create: {
        cadastrante: true, ...idFieldRegistration
      },
      update: {
        cadastrante: true,
      },
    })
    return reply.status(201).send({ id })
  } catch (err: any) {
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof AlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof Error) {
      return reply.status(412).send({ message: err.message })
      
    }

    return reply.status(500).send({ message: err.message })
  }
}
