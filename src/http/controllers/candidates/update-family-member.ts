import { FamilyMemberAlreadyExistsError } from '@/errors/family-member-already-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateFamilyMemberInfo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const Relationship = z.enum([
    'Wife',
    'Husband',
    'Father',
    'Mother',
    'Stepfather',
    'Stepmother',
    'Sibling',
    'Grandparent',
    'Child',
    'Other',
  ])
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
  const Institution_Type = z.enum(['Public', 'Private'])
  const Education_Type = z.enum([
    'Alfabetizacao',
    'Ensino_Medio',
    'Ensino_Tecnico',
    'Ensino_Superior',
  ])
  const SHIFT = z.enum(['Matutino', 'Vespertino', 'Noturno', 'Integral'])

  const familyMemberDataSchema = z.object({
    relationship: Relationship,
    otherRelationship: z.string().optional(),
    fullName: z.string(),
    socialName: z.string().optional(),
    birthDate: z.string(),
    gender: GENDER,
    nationality: z.string(),
    natural_city: z.string(),
    natural_UF: COUNTRY,
    RG: z.string(),
    rgIssuingAuthority: z.string(),
    rgIssuingState: z.string(),
    documentType: DOCUMENT_TYPE.optional(),
    documentNumber: z.string().optional(),
    documentValidity: z.string().optional(),
    numberOfBirthRegister: z.string(),
    bookOfBirthRegister: z.string(),
    pageOfBirthRegister: z.string(),
    maritalStatus: MARITAL_STATUS,
    skinColor: SkinColor,
    religion: RELIGION,
    educationLevel: SCHOLARSHIP,
    specialNeeds: z.boolean().optional(),
    specialNeedsDescription: z.string().optional(),
    hasMedicalReport: z.boolean().optional(),
    landlinePhone: z.string().optional(),
    workPhone: z.string().optional(),
    contactNameForMessage: z.string().optional(),
    address: z.string(),
    city: z.string(),
    UF: COUNTRY,
    CEP: z.string(),
    neighborhood: z.string(),
    addressNumber: z.number().int(),
    profession: z.string(),
    enrolledGovernmentProgram: z.boolean().optional(),
    NIS: z.string().optional(),
    educationPlace: z.union([Institution_Type, z.undefined()]),
    institutionName: z.string().optional(),
    coursingEducationLevel: z.union([Education_Type, z.undefined()]),
    cycleOfEducation: z.string().optional(),
    turnOfEducation: z.union([SHIFT, z.undefined()]),
    hasScholarship: z.boolean().optional(),
    percentageOfScholarship: z.string().optional(),
    monthlyAmount: z.string().optional(),
  })

  const {
    CEP,
    RG,
    UF,
    address,
    addressNumber,
    birthDate,
    bookOfBirthRegister,
    city,
    educationLevel,
    fullName,
    gender,
    maritalStatus,
    nationality,
    natural_UF,
    natural_city,
    neighborhood,
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
  } = familyMemberDataSchema.parse(request.body)

  try {
    const user_id = request.user.sub

    const fetchFamilyMemberParamsSchema = z.object({
      _id: z.string().optional(),
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
   

    const parsedData = {
      monthlyAmount,
      educationLevel,
      workPhone,
      numberOfBirthRegister,
      pageOfBirthRegister,
      address,
      addressNumber,
      birthDate: new Date(birthDate),
      CEP,
      city,
      hasScholarship,
      coursingEducationLevel,
      cycleOfEducation,
      documentNumber,
      documentType,
      documentValidity: documentValidity ? new Date(documentValidity) : null,
      educationPlace,
      enrolledGovernmentProgram,
      hasMedicalReport,
      institutionName,
      landlinePhone,
      fullName,
      gender,
      maritalStatus,
      nationality,
      natural_city,
      natural_UF,
      neighborhood,
      profession,
      relationship,
      religion,
      RG,
      rgIssuingAuthority,
      rgIssuingState,
      skinColor,
      UF,
      bookOfBirthRegister,
      contactNameForMessage,
      NIS,
      otherRelationship,
      percentageOfScholarship,
      socialName,
      specialNeeds,
      specialNeedsDescription,
      turnOfEducation,
    }
    const dataToUpdate: Record<string,any> = {};

    for (const key in parsedData) {
      const value = parsedData[key as keyof typeof parsedData];
      if (value !== undefined && value !== null) {
        dataToUpdate[key as keyof typeof parsedData] = value;
      }
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
