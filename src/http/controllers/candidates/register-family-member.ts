import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerFamilyMemberInfo(
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
    'PrivatePension'
  ])

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
    CPF: z.string(),
    RG: z.string(),
    rgIssuingAuthority: z.string(),
    rgIssuingState: z.string(),
    documentType: DOCUMENT_TYPE.optional(),
    documentNumber: z.string().optional(),
    documentValidity: z.string().optional(),
    numberOfBirthRegister: z.string().optional(),
    bookOfBirthRegister: z.string().optional(),
    pageOfBirthRegister: z.string().optional(),
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
    email: z.string().email().optional(),
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
    coursingEducationLevel: z.union([Education_Type, z.undefined()]).optional(),
    cycleOfEducation: z.string().optional(),
    turnOfEducation: z.union([SHIFT, z.undefined()]).optional(),
    hasScholarship: z.boolean().optional(),
    percentageOfScholarship: z.string().optional(),
    monthlyAmount: z.string().optional(),
    incomeSource: z.array(IncomeSource).optional(),
  })
  console.log('====================================');
  console.log(request.body);
  console.log('====================================');
  const {
    CEP,
    CPF,
    RG,
    UF,
    address,
    addressNumber,
    birthDate,
    bookOfBirthRegister,
    city,
    educationLevel,
    email,
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
    incomeSource
  } = familyMemberDataSchema.parse(request.body)
  
  try {
    const user_id = request.user.sub

    // Verifica se existe um candidato associado ao user_id
    const candidate = await prisma.candidate.findUnique({ where: { user_id } })
    if (!candidate) {
      throw new ResourceNotFoundError()
    }

    // Verifica se já existe um familiar com o RG ou CPF associados ao candidato
    if (
      await prisma.familyMember.findFirst({
        where: { CPF, candidate_id: candidate.id },
      })
    ) {
      throw new NotAllowedError()
    }
    if (
      await prisma.familyMember.findFirst({
        where: { RG, candidate_id: candidate.id },
      })
    ) {
      throw new NotAllowedError()
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
      address,
      city,
      UF,
      CEP,
      neighborhood,
      addressNumber,
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
    };
    
    console.log('====================================');
    console.log(dataToCreate);
    console.log('====================================');
    await prisma.familyMember.create({
      data: dataToCreate
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
