import { ForbiddenError } from '@/errors/forbidden-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { calculateAge } from '@/utils/calculate-age'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createLegalDependent } from '../legal-responsible/create-legal-dependent'
import { DOCUMENT_TYPE } from './enums/Document_Type'
import { Education_Type } from './enums/Education_Type'
import { GENDER } from './enums/Gender'
import IncomeSource from './enums/IncomeSource'
import { Institution_Type } from './enums/Intitution_Type'
import { MARITAL_STATUS } from './enums/Marital_Status'
import { Relationship } from './enums/Relationship'
import { RELIGION } from './enums/Religion'
import { SCHOLARSHIP } from './enums/Scholarship'
import { SHIFT } from './enums/Shift'
import { SkinColor } from './enums/SkinColor'
import { UF } from './enums/UF'

export async function registerFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {


  const familyMemberDataSchema = z.object({
    relationship: Relationship,
    otherRelationship: z.string().optional(),
    fullName: z.string(),
    socialName: z.string().optional(),
    birthDate: z.string(),
    gender: GENDER,
    nationality: z.string(),
    natural_city: z.string(),
    natural_UF: UF,
    CPF: z.string(),
    RG: z.string(),
    rgIssuingAuthority: z.string(),
    rgIssuingState: z.string(),
    documentType: DOCUMENT_TYPE.nullish(),
    documentNumber: z.string().nullish(),
    documentValidity: z.string().nullish(),
    numberOfBirthRegister: z.string().nullish(),
    bookOfBirthRegister: z.string().nullish(),
    pageOfBirthRegister: z.string().nullish(),
    maritalStatus: MARITAL_STATUS,
    skinColor: SkinColor,
    religion: RELIGION,
    educationLevel: SCHOLARSHIP,
    specialNeeds: z.boolean().nullish(),
    specialNeedsDescription: z.string().nullish(),
    specialNeedsType: z.string().nullish(),
    hasMedicalReport: z.boolean().nullish(),
    landlinePhone: z.string().nullish(),
    workPhone: z.string().nullish(),
    contactNameForMessage: z.string().nullish(),
    email: z.string().email().nullish(),
    /* address: z.string(),
    city: z.string(),
    UF: COUNTRY,
    CEP: z.string(),
    neighborhood: z.string(),
    addressNumber: z.string(), */
    profession: z.string(),
    enrolledGovernmentProgram: z.string().optional(),
    NIS: z.string().optional(),
    educationPlace: z.union([Institution_Type, z.undefined()]),
    institutionName: z.string().optional(),
    coursingEducationLevel: z.union([Education_Type, z.undefined()]).optional(),
    attendedPublicHighSchool: z.boolean(),
    benefitedFromCebasScholarship_basic: z.boolean(),
    benefitedFromCebasScholarship_professional: z.boolean(),
    CadUnico: z.boolean(),
    cycleOfEducation: z.string().optional(),
    turnOfEducation: z.union([SHIFT, z.undefined()]).optional(),
    hasScholarship: z.boolean().optional(),
    percentageOfScholarship: z.string().optional(),
    monthlyAmount: z.string().optional(),
    incomeSource: z.array(IncomeSource).optional(),
    hasSevereDeseaseOrUsesMedication: z.boolean().default(false),
    hasBankAccount: z.boolean().default(false),
  })
  console.log('====================================')
  console.log(request.body)
  console.log('====================================')
  const {
    CPF,
    RG,
    birthDate,
    bookOfBirthRegister,
    educationLevel,
    email,
    fullName,
    gender,
    maritalStatus,
    nationality,
    natural_UF,
    natural_city,
    numberOfBirthRegister,
    pageOfBirthRegister,
    profession,
    relationship,
    religion,
    rgIssuingAuthority,
    rgIssuingState,
    skinColor,
    NIS,
    contactNameForMessage,
    hasScholarship,
    coursingEducationLevel,
    cycleOfEducation,
    documentNumber,
    documentType,
    documentValidity,
    educationPlace,
    enrolledGovernmentProgram,
    hasMedicalReport,
    institutionName,
    landlinePhone,
    monthlyAmount,
    otherRelationship,
    percentageOfScholarship,
    socialName,
    specialNeeds,
    specialNeedsDescription,
    turnOfEducation,
    workPhone,
    incomeSource,
    attendedPublicHighSchool,
    benefitedFromCebasScholarship_basic,
    benefitedFromCebasScholarship_professional,
    CadUnico,
    hasSevereDeseaseOrUsesMedication,
    hasBankAccount,
    specialNeedsType
  } = familyMemberDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub
    const candidateOrResponsible = await SelectCandidateResponsible(user_id)
    if (!candidateOrResponsible) {
      throw new ForbiddenError()
    }

    const idField = (candidateOrResponsible.IsResponsible ? { legalResponsibleId: candidateOrResponsible.UserData.id } : { candidate_id: candidateOrResponsible.UserData.id })

    // Verifica se já existe um familiar com o RG ou CPF associados ao candidato
    if (
      await prisma.familyMember.findFirst({
        where: {
          AND: [
            { CPF },
            idField
          ]
        },
      })
    ) {
      throw new Error('CPF já existe para outro membro familiar')
    }
    if (
      await prisma.familyMember.findFirst({
        where: {
          AND: [
            { RG },
            idField
          ]
        },
      })
    ) {
      throw new Error('RG já existe para outro membro familiar')
    }

    const dataToCreate = {
      relationship,
      fullName,
      birthDate: new Date(birthDate),
      gender,
      nationality,
      natural_city,
      natural_UF,
      CPF,
      RG,
      rgIssuingAuthority,
      rgIssuingState,
      maritalStatus,
      skinColor,
      religion,
      educationLevel,
      email,
      profession,
      attendedPublicHighSchool,
      benefitedFromCebasScholarship_basic,
      benefitedFromCebasScholarship_professional,
      enrolledGovernmentProgram,
      CadUnico,
      hasSevereDeseaseOrUsesMedication,
      hasBankAccount,
      specialNeedsType,
      ...idField,
      // Campos opcionais são adicionados condicionalmente
      ...(otherRelationship && { otherRelationship }),
      ...(socialName && { socialName }),
      ...(documentType && { documentType }),
      ...(documentNumber && { documentNumber }),
      ...(documentValidity && { documentValidity: new Date(documentValidity) }),
      ...(numberOfBirthRegister && { numberOfBirthRegister }),
      ...(bookOfBirthRegister && { bookOfBirthRegister }),
      ...(pageOfBirthRegister && { pageOfBirthRegister }),
      ...(specialNeeds && { specialNeeds }),
      ...(specialNeedsDescription && { specialNeedsDescription }),
      ...(hasMedicalReport && { hasMedicalReport }),
      ...(landlinePhone && { landlinePhone }),
      ...(workPhone && { workPhone }),
      ...(contactNameForMessage && { contactNameForMessage }),
      ...(enrolledGovernmentProgram && { enrolledGovernmentProgram }),
      ...(NIS && { NIS }),
      ...(educationPlace && { educationPlace }),
      ...(institutionName && { institutionName }),
      ...(coursingEducationLevel && { coursingEducationLevel }),
      ...(cycleOfEducation && { cycleOfEducation }),
      ...(turnOfEducation && { turnOfEducation }),
      ...(hasScholarship && { hasScholarship }),
      ...(percentageOfScholarship && { percentageOfScholarship }),
      ...(monthlyAmount && { monthlyAmount }),
      ...(incomeSource && { incomeSource }),
    }

    const { id } = await prisma.familyMember.create({
      data: dataToCreate,
    })

    const age = calculateAge(new Date(birthDate))
    if (age < 18 && candidateOrResponsible.IsResponsible) {
      await createLegalDependent(fullName, CPF, birthDate, candidateOrResponsible.UserData.id)
    }

    await prisma.finishedRegistration.upsert({
      where: idField,
      create: { grupoFamiliar: true, ...idField },
      update: {
        grupoFamiliar: true,
      }
    })
    return reply.status(201).send({ id })
  } catch (err: any) {
    console.log(err)
    if (err instanceof NotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
