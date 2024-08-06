import { ForbiddenError } from '@/errors/forbidden-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { calculateAge } from '@/utils/calculate-age'
import { SelectCandidateResponsible } from '@/utils/select-candidate-responsible'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { updateLegalDependent } from '../legal-responsible/update-legal-dependent'
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
export async function updateFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {











  const familyMemberDataSchema = z.object({
    relationship: Relationship,
    otherRelationship: z.string().optional().nullable(),
    fullName: z.string(),
    socialName: z.string().optional().nullable(),
    birthDate: z.string(),
    gender: GENDER,
    nationality: z.string(),
    natural_city: z.string(),
    natural_UF: UF,
    CPF: z.string(),
    RG: z.string(),
    rgIssuingAuthority: z.string(),
    rgIssuingState: z.string(),
    documentType: DOCUMENT_TYPE.optional().nullable(),
    documentNumber: z.string().optional().nullable(),
    documentValidity: z.string().optional().nullable(),
    numberOfBirthRegister: z.string().optional().nullable(),
    bookOfBirthRegister: z.string().optional().nullable(),
    pageOfBirthRegister: z.string().optional().nullable(),
    maritalStatus: MARITAL_STATUS,
    skinColor: SkinColor,
    religion: RELIGION,
    educationLevel: SCHOLARSHIP,
    specialNeeds: z.boolean().optional().nullable(),
    specialNeedsDescription: z.string().optional().nullable(),
    specialNeedsType: z.string().optional().nullable(),
    hasMedicalReport: z.boolean().optional().nullable(),
    landlinePhone: z.string().optional().nullable(),
    workPhone: z.string().optional().nullable(),
    contactNameForMessage: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    profession: z.string(),
    enrolledGovernmentProgram: z.string().optional().nullable(),
    NIS: z.string().optional().nullable(),
    educationPlace: z.union([Institution_Type, z.null()]),
    institutionName: z.string().optional().nullable(),
    coursingEducationLevel: z.union([Education_Type, z.null()]).optional().nullable(),
    cycleOfEducation: z.string().optional().nullable(),
    attendedPublicHighSchool: z.boolean().nullish(),
    benefitedFromCebasScholarship_basic: z.boolean().nullish(),
    benefitedFromCebasScholarship_professional: z.boolean().nullish(),
    CadUnico: z.boolean().nullish(),
    turnOfEducation: z.union([SHIFT, z.null()]).optional().nullable(),
    hasScholarship: z.boolean().optional().nullable(),
    percentageOfScholarship: z.string().optional().nullable(),
    monthlyAmount: z.string().optional().nullable(),
    incomeSource: z.array(IncomeSource).optional().nullable(),
    hasSevereDeseaseOrUsesMedication: z.boolean().nullish(),
    hasBankAccount: z.boolean().nullish(),
  }).partial()

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

    const fetchFamilyMemberParamsSchema = z.object({
      _id: z.string(),
    })

    const { _id } = fetchFamilyMemberParamsSchema.parse(request.params)



    const CandidateOrResponsible = await SelectCandidateResponsible(user_id)

    if (!CandidateOrResponsible) {
      throw new ForbiddenError()
    }
    const familyMember = await prisma.familyMember.findUnique({ where: { id: _id } })
    // Verifica se o familiar em especifico existe
    if (!familyMember) {
      throw new ResourceNotFoundError()
    }

    const idField = CandidateOrResponsible.IsResponsible ? { legalResponsibleId: CandidateOrResponsible.UserData.id } : { candidate_id: CandidateOrResponsible.UserData.id }
    const dataToUpdate = {
      relationship,
      fullName,
      birthDate: new Date(birthDate ?? Date.now()),
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
      NIS,
      CadUnico,
      hasSevereDeseaseOrUsesMedication,
      hasBankAccount,
      specialNeedsType,
      specialNeeds,
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
    if (CPF) {

      const cpfExists = await prisma.familyMember.findFirst({
        where: {
          AND: [
            { CPF },
            { NOT: idField }
          ]
        },
      })
      if (cpfExists) {
        throw new Error('CPF já existe para outro membro familiar')
      }
    }

    if (RG) {

      const rgExists = await prisma.familyMember.findFirst({
        where: {
          AND: [
            { RG },
            { NOT: idField }
          ]
        },
      })

      if (rgExists) {
        throw new Error('RG já existe para outro membro familiar')
      }
    }
    // Atualiza informações acerca do membro da família do candidato
    const memberUpdated = await prisma.familyMember.update({
      data: dataToUpdate,
      where: { id: _id }
    });

    await prisma.finishedRegistration.upsert({
      where: idField,
      create: { grupoFamiliar: true, ...idField },
      update: {
        grupoFamiliar: true,
      }
    })
    const age = calculateAge(new Date(memberUpdated.birthDate))

    if (age < 18 && CandidateOrResponsible.IsResponsible) {
      await updateLegalDependent(memberUpdated.fullName, memberUpdated.CPF, familyMember.CPF, memberUpdated.birthDate.toString(), CandidateOrResponsible.UserData.id)
    }

    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof Error) {
      return reply.status(412).send({ message: err.message })
    }
    if (err instanceof ForbiddenError) {
      return reply.status(403).send({ message: err.message })
    }

    return reply.status(500).send({ message: err.message })
  }
}
