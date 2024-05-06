import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import IncomeSource from './enums/IncomeSource'
import { Relationship } from './enums/Relationship'
import { UF } from './enums/UF';
import { GENDER } from './enums/Gender';
import { DOCUMENT_TYPE } from './enums/Document_Type';
import { SkinColor } from './enums/SkinColor'
import { RELIGION } from './enums/Religion'
import { SCHOLARSHIP } from './enums/Scholarship'
import { Institution_Type } from './enums/Intitution_Type'
import { Education_Type } from './enums/Education_Type'
import { SHIFT } from './enums/Shift'
import { MARITAL_STATUS } from './enums/Marital_Status';
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
    hasMedicalReport: z.boolean().optional().nullable(),
    landlinePhone: z.string().optional().nullable(),
    workPhone: z.string().optional().nullable(),
    contactNameForMessage: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    profession: z.string(),
    enrolledGovernmentProgram: z.boolean().optional().nullable(),
    NIS: z.string().optional().nullable(),
    educationPlace: z.union([Institution_Type, z.null()]),
    institutionName: z.string().optional().nullable(),
    coursingEducationLevel: z.union([Education_Type, z.null()]).optional().nullable(),
    cycleOfEducation: z.string().optional().nullable(),
    turnOfEducation: z.union([SHIFT, z.null()]).optional().nullable(),
    hasScholarship: z.boolean().optional().nullable(),
    percentageOfScholarship: z.string().optional().nullable(),
    monthlyAmount: z.string().optional().nullable(),
    incomeSource: z.array(IncomeSource).optional().nullable(),
  })

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
  } = familyMemberDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    const fetchFamilyMemberParamsSchema = z.object({
      _id: z.string(),
    })

    const { _id } = fetchFamilyMemberParamsSchema.parse(request.params)

    if (!user_id) {
      throw new NotAllowedError()
    }

    const candidate = await prisma.candidate.findUnique({ where: { user_id } })

    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se o familiar em especifico existe
    if (!await prisma.familyMember.findUnique({ where: { id: _id } })) {
      throw new ResourceNotFoundError()
    }


    const dataToUpdate = {
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
      candidate_id: candidate.id,
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

    // Atualiza informações acerca do membro da família do candidato
    await prisma.familyMember.update({
      data: dataToUpdate,
      where: { id: _id }
    });


    return reply.status(201).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }


    return reply.status(500).send({ message: err.message })
  }
}
