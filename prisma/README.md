# Banco de dados Cadastraqui:

## **Diagrama de Entidade - Relacionamento**
[Acesse aqui o diagrama do banco de dados](https://dbdiagram.io/d/DB-Cadastraqui-660e1bbe03593b6b612139e4)
## Entidades
As entidades (tabelas) contidas no banco de dados são:
1.  `Candidate` : Informações básicas de todos os candidatos, pode ou não ser um usuário.
2.  `User` : Informações gerais de todos os usuários (Candidato, Assistente, Entidate, etc).
3.  `LegalResponsible`: Usuário responsável Legal, contém o mesmo conjunto de informação que *Candidate*, mas contém uma relação **one-to-many** com essa tabela.
4.  `SocialAssistant`: Usuário Assistente Social. Contém as informações como qual entidade e/ou editais ele está relacionado.
5.  `Entity`: Usuário Entidade. Contéma as informações gerais da entidade, além dos editais, subsidiarias, diretores e assistentes que estão ligados a ela.
6.  `EntitySubsidiary`: Subsidiária da entidade. Contém informações gerais, mas não realiza nenhuma ação, apenas serve de local para vagas em editais.
7.  `EntityDirector` : Diretor/ Responsável pela entidade.
8. `IdentityDetails` : Informações de identificação do cadastrante (candidato / responsável legal). Realizada na sessão de cadastro
9.  `FamilyMember` : Membros da Família que moram na mesma residência do cadastrante. Contém um conjunto mais complexo, assim como o *IdentityDetails* . 
10.  `Housing`: Informaçõs de moradia do cadastrante.
11.  `Vehicle`: Informações sobre os veículos que o cadastrante ou grupo familiar possuem.
12. `FamilyMemberIncome`: Informações sobre o tipo de renda do membro familiar ou cadastrante. 
13.  `MonthlyIncome`: Informações de valores de renda mensal atrelados a algum tipo de renda. Por exemplo, pode conter os detalhes do salário de um determinado mês ou conjunto de meses.
14.  `Expense` : Conjunto de informações sobre a despesa média mensal do cadastrante e grupo familiar.
15.  `Loan`:  Empréstimos que o grupo familiar possui.
16.  `Financing`: Financiamentos que o grupo familiar possui.
17.  `CreditCard`: Gastos de cartão de crédito 
18.  `OtherExpense`: Outos tipos de despesas.
19.  `FamilyMemberDisease`: Detalhes sobre os tipo de doenças (geralmente de caráter crônico) que o cadastrante ou grupo familiar possuem.
20.  `Medication`: Dados sobre os tipos e gastos com medicamento.
 21. `Announcement`: Conjunto de informações gerais sobre um determinado edital. Possui dados como data de inicio e fim das inscrições, quais os assistentes responsáveis, as subsidiárias envolvidas, etc.
22.  `Timeline`: Linha do tempo dos processos do edital (caso possua)
23.  `EducationLevel`: Detalhes sobre cada uma das vagas de um edital. Contém os dados de curso, período, quantidade de vagas, qual a matriz ou filial que a vaga está atrelada, etc.
24.  `Application`: Informações da inscrição do candidato numa determinada vaga.
25.  `ApplicationHistory`: Histórico de atualizações de uma determinada inscrição. As solicitações da assistente social ficam nessa tabela.
26.  `ScholarshipGranted`: Contém informações sobre as concessões dadas para um candidato. Apenas para os candidatos que tiverem inscrição deferida.
27.  `FamilyMemberToVehicle`: Tabela intermediária, apenas para facilitar a relação **Many-to-Many** de um veiculo com o grupo familiar.



## Atributos:

### User (tabela "users"):
 -   `id`: String, não nulo, identificador único gerado automaticamente.
-   `email`: String, não nulo, único.
-   `password`: String, não nulo.
-   `role`: Enum (ROLE), não nulo, valor padrão é "CANDIDATE".
-   `createdAt`: DateTime, não nulo, valor padrão é a data e hora atual.
-   `profilePicture`: String, pode ser nulo.
-   `EntityDirector`: EntityDirector, pode ser nulo.
-   `EntitySubsidiary`: EntitySubsidiary, pode ser nulo.
-   `SocialAssistant`: SocialAssistant, pode ser nulo.
-   `Candidate`: Candidate, pode ser nulo.
-   `Entity`: Entity, pode ser nulo.
-   `LegalResponsible`: LegalResponsible, pode ser nulo.
### Candidate (tabela "candidates"):
- `id`: String, não nulo, identificador único gerado automaticamente.
- `name`: String, não nulo.
- `CPF`: String, não nulo, único.
- `birthDate`: DateTime, não nulo.
- `phone`: String, não nulo.
- `address`: String, não nulo.
- `city`: String, não nulo.
- `UF`: Enum (COUNTRY), não nulo.
- `CEP`: String, não nulo.
- `neighborhood`: String, não nulo.
- `addressNumber`: String, não nulo.
- `role`: Enum (ROLE), não nulo, valor padrão é "CANDIDATE".
- `createdAt`: DateTime, não nulo, valor padrão é a data e hora atual.
- `user_id`: String, pode ser nulo, único.
- `responsible_id`: String, pode ser nulo.
- `profilePicture`: String, pode ser nulo.
- `email`: String, pode ser nulo.
- `finishedRegistration`: Boolean, não nulo, valor padrão é false. Verifica se o usuário já terminou o cadastro de todas as informações necessárias para as inscrições em editais.
- `Application`: Array de Application, pode ser vazio.
- `CreditCard`: Array de CreditCard, pode ser vazio.
- `Expense`: Array de Expense, pode ser vazio.
- `Financing`: Array de Financing, pode ser vazio.
- `IdentityDetails`: IdentityDetails, pode ser nulo.
- `FamilyMemberIncome`: Array de FamilyMemberIncome, pode ser vazio.
- `Loan`: Array de Loan, pode ser vazio.
- `OtherExpense`: Array de OtherExpense, pode ser vazio.
- `Vehicle`: Array de Vehicle, pode ser vazio.
- `responsible`: LegalResponsible, pode ser nulo.
- `user`: User, pode ser nulo.
- `FamillyMember`: Array de FamilyMember, pode ser vazio.
- `Housing`: Housing, pode ser nulo.
- `MonthlyIncome`: Array de MonthlyIncome, pode ser vazio.
- `FamilyMemberDisease`: Array de FamilyMemberDisease, pode ser vazio.
- `Medication`: Array de Medication, pode ser vazio.
### LegalResponsible (tabela "responsibles"):
 
- `id`: String, não nulo, identificador único gerado automaticamente.
- `name`: String, não nulo.
- `CPF`: String, não nulo, único.
- `birthDate`: DateTime, não nulo.
- `phone`: String, não nulo.
- `address`: String, não nulo.
- `city`: String, não nulo.
- `UF`: Enum (COUNTRY), não nulo.
- `CEP`: String, não nulo.
- `neighborhood`: String, não nulo.
- `addressNumber`: String, não nulo.
- `livesAtSameAddress`: Boolean, pode ser nulo. Verifica se o usuário mora no mesmo endereço que os candidatos aos quais é responsável.
- `institutionType`: Enum (INSTITUTION_TYPE), pode ser nulo. Tipo da instituição que estudou (pública ou privada)
- `responsibleEducationLevel`: Enum (EDUCATION_TYPE), pode ser nulo. Nível de escolaridade do responsável.
- `responsibleGradeOrSemester`: String, pode ser nulo. Pode ser lido como: "Até qual ano ou semestre foi, caso não tenha concluido o colégio/faculdade ?
- `responsibleShift`: Enum (SHIFT), pode ser nulo. Turno que estudou. 
- `ResponsibleEducationInstitution`: String, pode ser nulo. Instituição em que estudou
- `role`: Enum (ROLE), não nulo, valor padrão é "RESPONSIBLE".
- `createdAt`: DateTime, não nulo, valor padrão é a data e hora atual.
- `user_id`: String, único, pode ser nulo.
- `hasScholarship`: Boolean, pode ser nulo. Verifica se o responsável possui bolsa de estudo na instituição que atualmente faz parte.
- `monthlyAmount`: String, pode ser nulo. Valor da mensal bolsa de estudo, caso possua.
- `percentageOfScholarship`: String, pode ser nulo. Porcentagem da bolsa de estudo. 
- `IdentityDetails`: IdentityDetails, pode ser nulo.
- `Candidate`: Array de Candidate, pode ser vazio.
- `Housing`: Housing, pode ser nulo.
- `FamillyMember`: Array de FamilyMember, pode ser vazio.
- `CreditCard`: Array de CreditCard, pode ser vazio.
- `Expense`: Array de Expense, pode ser vazio.
- `Financing`: Array de Financing, pode ser vazio.
- `Loan`: Array de Loan, pode ser vazio.
- `OtherExpense`: Array de OtherExpense, pode ser vazio.
- `Vehicle`: Array de Vehicle, pode ser vazio.
- `user`: User, pode ser nulo.
- `FamilyMemberDisease`: Array de FamilyMemberDisease, pode ser vazio.
- `Medication`: Array de Medication, pode ser vazio.

### SocialAssistant (tabela "assistants"):
 -   `id`: String, não nulo, identificador único gerado automaticamente.
-   `name`: String, não nulo.
-   `CPF`: String, não nulo, único.
-   `RG`: String, não nulo, único.
-   `CRESS`: String, não nulo, único.
-   `phone`: String, não nulo.
-   `user_id`: String, não nulo, único.
-   `entity_id`: String, não nulo.
-   `Application`: Array de Application, pode ser vazio.
-   `entity`: Entity, não nulo.
-   `user`: User, não nulo.
-   `Announcement`: Array de Announcement, pode ser vazio.
-   `entity_subsidiary`: Array de EntitySubsidiary, pode ser vazio.
### Entity (tabela "entities"):
-   `id`: String, não nulo, identificador único gerado automaticamente.
-   `name`: String, pode ser nulo. Nome da entidade (pode ser igual à razão Social).
-   `socialReason`: String, não nulo. Razão Social da entidade
-   `logo`: String, pode ser nulo.
-   `CNPJ`: String, não nulo, único.
-   `CEP`: String, não nulo.
-   `address`: String, não nulo.
-   `educationalInstitutionCode`: String, pode ser nulo.
-   `user_id`: String, não nulo, único.
-   `Announcement`: Array de Announcement, pode ser vazio.
-   `EntityDirector`: Array de EntityDirector, pode ser vazio.
-   `EntitySubsidiary`: Array de EntitySubsidiary, pode ser vazio.
-   `SocialAssistant`: Array de SocialAssistant, pode ser vazio.
-   `user`: User, não nulo.
### EntitySubsidiary (tabela "EntitySubsidiary "):
  -   `id`: String, não nulo, identificador único gerado automaticamente.
-   `CNPJ`: String, não nulo, único.
-   `name`: String, não nulo.
-   `socialReason`: String, não nulo.
-   `CEP`: String, não nulo.
-   `address`: String, não nulo.
-   `educationalInstitutionCode`: String, pode ser nulo.
-   `entity_id`: String, não nulo.
-   `user_id`: String, não nulo, único.
-   `Announcement`: Array de Announcement, pode ser vazio.
-   `EntityDirector`: Array de EntityDirector, pode ser vazio.
-   `entity`: Entity, não nulo.
-   `user`: User, não nulo.
-   `SocialAssistant`: Array de SocialAssistant, pode ser vazio.
-   `EducationLevel`: Array de EducationLevel, pode ser vazio.


### EntityDirector:

- `id`: String, não nulo, identificador único gerado automaticamente.
- `name`: String.
- `CPF`: String, único.
- `phone`: String.
- `user_id`: String, único.
- `entity_subsidiary_id`: String, pode ser nulo.
- `entity_id`: String, pode ser nulo.
- `entity`: Entity, pode ser nulo.
- `entity_subsidiary`: EntitySubsidiary, pode ser nulo.
- `user`: User.

### IdentityDetails:

- `id`: String, não nulo, identificador único gerado automaticamente.
- `fullName`: String.
- `socialName`: String.
- `birthDate`: DateTime.
- `gender`: GENDER.
- `nationality`: String.
- `natural_city`: String.
- `natural_UF`: COUNTRY.
- `RG`: String, único.
- `rgIssuingAuthority`: String.
- `rgIssuingState`: String.
- `documentType`: DOCUMENT_TYPE, pode ser nulo. Aparece apenas caso não seja preenchido o campo do RG.
- `CadUnico`: Boolean, padrão é falso. Verifica se o grupo familiar do cadastrante tem CadUnico.
- `hasSevereDesease`: Boolean, padrão é falso. Verifica se alguem do grupo familiar do cadastrante possui alguma doença grave.
- `documentNumber`: String, pode ser nulo. Número de registro do documento alternativo.
- `documentValidity`: DateTime, pode ser nulo.
- `maritalStatus`: MARITAL_STATUS.
- `skinColor`: SkinColor.
- `religion`: RELIGION.
- `educationLevel`: SCHOLARSHIP.
- `specialNeeds`: Boolean, pode ser nulo. *"Possui necessidades especiais?"*
- `specialNeedsDescription`: String, pode ser nulo. Descrição das necessidades especiais, caso possua
- `hasMedicalReport`: Boolean, pode ser nulo. *Possui laudo médico que comprove as necessidades especiais?*
- `landlinePhone`: String, pode ser nulo.
- `workPhone`: String, pode ser nulo.
- `contactNameForMessage`: String, pode ser nulo. Nome para contato,
- `profession`: String.
- `enrolledGovernmentProgram`: Boolean, pode ser nulo. Verifica se o cadastrante está em algum programa de auxilio governamental.
- `NIS`: String, pode ser nulo.
- `incomeSource`: Array de IncomeSource.
- `livesAlone`: Boolean.
- `intendsToGetScholarship`: Boolean. *"Deseja competir para vagas de bolsa de estudo?"*
- `attendedPublicHighSchool`: Boolean, pode ser nulo. *"Fez Ensino médio em Escola Pública?*
- `benefitedFromCebasScholarship_basic`: Boolean, pode ser nulo. *"Recebeu bolsa Cebas durante a educação básica?"*
- `yearsBenefitedFromCebas_basic`: Array de String. Anos que recebeu bolsa Cebas
- `scholarshipType_basic`: ScholarshipType, pode ser nulo. Tipo de bolsa
- `institutionName_basic`: String, pode ser nulo.
- `institutionCNPJ_basic`: String, pode ser nulo.
- `benefitedFromCebasScholarship_professional`: Boolean, pode ser nulo. *"Recebeu bolsa Cebas durante a educação profissional?"*
- `lastYearBenefitedFromCebas_professional`: String, pode ser nulo.
- `scholarshipType_professional`: ScholarshipType, pode ser nulo.
- `institutionName_professional`: String, pode ser nulo.
- `institutionCNPJ_professional`: String, pode ser nulo.
- `nameOfScholarshipCourse_professional`: String, pode ser nulo.
- `candidate_id`: String, pode ser nulo, único.
- `responsible_id`: String, pode ser nulo, único.
- `candidate`: Candidate, pode ser nulo.
- `responsible`: LegalResponsible, pode ser nulo.

###  FamilyMember (tabela "familyMembers"):

- `id`: String, não nulo, identificador único gerado automaticamente.
- `relationship`: Relationship.
- `otherRelationship`: String, pode ser nulo.
- `fullName`: String.
- `socialName`: String, pode ser nulo.
- `birthDate`: DateTime.
- `gender`: GENDER.
- `nationality`: String.
- `natural_city`: String.
- `natural_UF`: COUNTRY.
- `CPF`: String.
- `RG`: String.
- `rgIssuingAuthority`: String.
- `rgIssuingState`: String.
- `documentType`: DOCUMENT_TYPE, pode ser nulo. Aparece apenas caso não seja preenchido o campo do RG.
- `documentNumber`: String, pode ser nulo.
- `documentValidity`: DateTime, pode ser nulo.
- `numberOfBirthRegister`: String, pode ser nulo. Dados da certidão de nascimento, caso não seja preenchido o campo do RG.
- `bookOfBirthRegister`: String, pode ser nulo.
- `pageOfBirthRegister`: String, pode ser nulo.
- `maritalStatus`: MARITAL_STATUS.
- `skinColor`: SkinColor.
- `religion`: RELIGION.
- `educationLevel`: SCHOLARSHIP.
- `specialNeeds`: Boolean, pode ser nulo.
- `specialNeedsDescription`: String, pode ser nulo.
- `hasMedicalReport`: Boolean, pode ser nulo.
- `landlinePhone`: String, pode ser nulo.
- `workPhone`: String, pode ser nulo.
- `contactNameForMessage`: String, pode ser nulo.
- `email`: String, pode ser nulo.
- `address`: String.
- `city`: String.
- `UF`: COUNTRY.
- `CEP`: String.
- `neighborhood`: String.
- `addressNumber`: String.
- `profession`: String.
- `enrolledGovernmentProgram`: Boolean, pode ser nulo.
- `NIS`: String, pode ser nulo.
- `educationPlace`: INSTITUTION_TYPE, pode ser nulo.
- `institutionName`: String, pode ser nulo.
- `coursingEducationLevel`: EDUCATION_TYPE, pode ser nulo. Grau de escolaridade (caso esteja cursando).
- `cycleOfEducation`: String, pode ser nulo. Ciclo/Série/Ano/Semestre que está cursando 
- `turnOfEducation`: SHIFT, pode ser nulo. 
- `hasScholarship`: Boolean, pode ser nulo.
- `percentageOfScholarship`: String, pode ser nulo.
- `monthlyAmount`: String, pode ser nulo.
- `candidate_id`: String, pode ser nulo.
- `incomeSource`: Array de IncomeSource.
- `CreditCard`: Array de CreditCard.
- `FamilyMemberIncome`: Array de FamilyMemberIncome.
- `Financing`: Array de Financing.
- `Loan`: Array de Loan.
- `MonthlyIncome`: Array de MonthlyIncome.
- `OtherExpense`: Array de OtherExpense.
- `FamilyMemberToVehicle`: Array de FamilyMemberToVehicle.
- `FamilyMemberDisease`: Array de FamilyMemberDisease.
- `candidate`: Candidate, pode ser nulo.
- `Medication`: Array de Medication.
- `LegalResponsible`: LegalResponsible, pode ser nulo.
- `legalResponsibleId`: String, pode ser nulo.

### Housing (tabela "housing"):

- `id`: String, não nulo, identificador único gerado automaticamente.
- `propertyStatus`: PropertyStatus.
- `contractType`: ContractType, pode ser nulo.
- `grantorName`: String, pode ser nulo. Nome de quem está concedendo o imóvel, caso se aplique.
- `timeLivingInProperty`: TimeLivingInProperty.
- `domicileType`: DomicileType.
- `numberOfRooms`: NumberOfRooms.
- `numberOfBedrooms`: Int.
- `candidate_id`: String, pode ser nulo, único.
- `responsible_id`: String, pode ser nulo, único.
- `candidate`: Candidate, pode ser nulo.
- `responsible`: LegalResponsible, pode ser nulo.

###  Vehicle:

- `id`: String, não nulo, identificador único gerado automaticamente.
- `vehicleType`: VehicleType.
- `modelAndBrand`: String.
- `manufacturingYear`: Int.
- `situation`: VehicleSituation.
- `financedMonths`: Int, pode ser nulo.
- `monthsToPayOff`: Int, pode ser nulo.
- `hasInsurance`: Boolean, padrão é falso.
- `insuranceValue`: Float, pode ser nulo.
- `usage`: VehicleUsage.
- `candidate_id`: String, pode ser nulo.
- `candidate`: Candidate, pode ser nulo.
- `FamilyMemberToVehicle`: Array de FamilyMemberToVehicle.
- `LegalResponsible`: LegalResponsible, pode ser nulo.
- `legalResponsibleId`: String, pode ser nulo.

### **FamilyMemberToVehicle:**
- `A`: String, não nulo. Pode ser lido como o id do familiar que é dono do veículo
- `B`: String, não nulo. Pode ser lido como o id do veículo que o familiar é dono
- `familyMembers`: FamilyMember, não nulo
- `Vehicle`: Vehicle, não nulo

###  FamilyMemberIncome:

- `id`: String, não nulo, identificador único gerado automaticamente.
- `employmentType`: EmploymentType. Tipo de Renda
- `averageIncome`: String. Renda média mensal
- `admissionDate`: DateTime, pode ser nulo.
- `position`: String, pode ser nulo. Cargo
- `payingSource`: String, pode ser nulo.
- `payingSourcePhone`: String, pode ser nulo.
- `startDate`: DateTime, pode ser nulo.
- `CNPJ`: String, pode ser nulo.
- `financialAssistantCPF`: String, pode ser nulo.
- `socialReason`: String, pode ser nulo.
- `fantasyName`: String, pode ser nulo.
- `CPNJ`: String, pode ser nulo.
- `receivesUnemployment`: Boolean, pode ser nulo.
- `parcels`: Int, pode ser nulo.
- `firstParcelDate`: DateTime, pode ser nulo.
- `parcelValue`: Float, pode ser nulo.
- `familyMember_id`: String, pode ser nulo.
- `familyMember`: FamilyMember, pode ser nulo.
- `candidate`: Candidate, pode ser nulo.
- `candidate_id`: String, pode ser nulo.

### **MonthlyIncome:**
- `id`: String, não nulo
- `month`: String, não nulo
- `year`: String, não nulo
- `grossAmount`: Float, pode ser nulo
- `liquidAmount`: Float, pode ser nulo
- `proLabore`: Float, pode ser nulo
- `dividends`: Float, pode ser nulo
- `total`: Float, pode ser nulo
- `deductionValue`: Decimal, pode ser nulo
- `publicPension`: Decimal, pode ser nulo
- `incomeTax`: Decimal, pode ser nulo
- `otherDeductions`: Decimal, pode ser nulo
- `foodAllowanceValue`: Decimal, pode ser nulo
- `transportAllowanceValue`: Decimal, pode ser nulo
- `expenseReimbursementValue`: Decimal, pode ser nulo
- `advancePaymentValue`: Decimal, pode ser nulo
- `reversalValue`: Decimal, pode ser nulo
- `compensationValue`: Decimal, pode ser nulo
- `judicialPensionValue`: Decimal, pode ser nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo
- `incomeSource`: IncomeSource, pode ser nulo

### **Expense:**
- `id`: String, não nulo
- `month`: String, não nulo
- `waterSewage`: Float, pode ser nulo
- `electricity`: Float, pode ser nulo
- `landlinePhone`: Float, pode ser nulo
- `mobilePhone`: Float, pode ser nulo
- `food`: Float, pode ser nulo
- `rent`: Float, pode ser nulo
- `garageRent`: Float, pode ser nulo
- `condominium`: Float, pode ser nulo
- `cableTV`: Float, pode ser nulo
- `streamingServices`: Float, pode ser nulo
- `fuel`: Float, pode ser nulo
- `annualIPVA`: Float, pode ser nulo
- `annualIPTU`: Float, pode ser nulo
- `annualITR`: Float, pode ser nulo
- `annualIR`: Float, pode ser nulo
- `INSS`: Float, pode ser nulo
- `publicTransport`: Float, pode ser nulo
- `schoolTransport`: Float, pode ser nulo
- `internet`: Float, pode ser nulo
- `courses`: Float, pode ser nulo
- `healthPlan`: Float, pode ser nulo
- `dentalPlan`: Float, pode ser nulo
- `medicationExpenses`: Float, pode ser nulo
- `totalExpense`: Float, pode ser nulo
- `candidate_id`: String, pode ser nulo
- `installmentCountIPTU`: Int, pode ser nulo
- `installmentCountIPVA`: Int, pode ser nulo
- `installmentCountIR`: Int, pode ser nulo
- `installmentCountITR`: Int, pode ser nulo
- `installmentValueIPTU`: Float, pode ser nulo
- `installmentValueIPVA`: Float, pode ser nulo
- `installmentValueIR`: Float, pode ser nulo
- `installmentValueITR`: Float, pode ser nulo
- `optedForInstallmentIPTU`: Boolean, pode ser nulo
- `optedForInstallmentIPVA`: Boolean, pode ser nulo
- `optedForInstallmentIR`: Boolean, pode ser nulo
- `optedForInstallmentITR`: Boolean, pode ser nulo
- `otherExpensesDescription`: Array de String, pode ser nulo
- `otherExpensesValue`: Array de Float, pode ser nulo

### **Loan:**
- `id`: String, não nulo
- `familyMemberName`: String, não nulo
- `installmentValue`: Float, não nulo
- `totalInstallments`: Int, não nulo
- `paidInstallments`: Int, não nulo
- `bankName`: String, não nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo

### **Financing:**
- `id`: String, não nulo
- `familyMemberName`: String, não nulo
- `installmentValue`: Float, não nulo
- `totalInstallments`: Int, não nulo
- `paidInstallments`: Int, não nulo
- `bankName`: String, não nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo
- `otherFinancing`: String, pode ser nulo
- `financingType`: FinancingType, não nulo

### **CreditCard:**
- `id`: String, não nulo
- `familyMemberName`: String, não nulo
- `usersCount`: Int, não nulo
- `cardType`: String, não nulo
- `bankName`: String, não nulo
- `cardFlag`: String, não nulo
- `invoiceValue`: Float, não nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo

### **OtherExpense:**
- `id`: String, não nulo
- `description`: String, não nulo
- `value`: Float, não nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo

### **FamilyMemberDisease (tabela "familyMemberDiseases"):**
- `id`: String, não nulo
- `disease`: Disease, pode ser nulo
- `diseases`: Array de Disease, pode ser nulo
- `specificDisease`: String, pode ser nulo
- `hasMedicalReport`: Boolean, não nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo

### **Medication (tabela "medications"):**
- `id`: String, não nulo
- `medicationName`: String, não nulo
- `obtainedPublicly`: Boolean, não nulo
- `specificMedicationPublicly`: String, pode ser nulo
- `familyMember_id`: String, pode ser nulo
- `candidate_id`: String, pode ser nulo

### **Announcement:**
- `id`: String, não nulo
- `entityChanged`: Boolean, pode ser nulo
- `branchChanged`: Boolean, pode ser nulo
- `announcementType`: AnnouncementType, não nulo
- `announcementNumber`: String, pode ser nulo
- `announcementDate`: DateTime, pode ser nulo
- `announcementBegin`: DateTime, pode ser nulo
- `offeredVacancies`: Int, pode ser nulo. Número de vagas totais (pode ser ignorado).
- `verifiedScholarships`: Int, pode ser nulo. Número total de bolsas ofertadas.
- `description`: String, pode ser nulo
- `entity_id`: String, não nulo
- `announcementName`: String, pode ser nulo
- `announcementLogo`: String, pode ser nulo
- `type2`: String, pode ser nulo
- `types1`: Array de scholarshipGrantedType, não nulo
- `entity`: Entity, não nulo
- `entity_subsidiary`: Array de EntitySubsidiary, não nulo
- `Application`: Array de Application, não nulo
- `educationLevels`: Array de EducationLevel, não nulo
- `ScholarshipGranted`: Array de ScholarshipGranted, não nulo
- `timelines`: Array de Timeline, não nulo. Linha do tempo do edital (caso desejado)
- `socialAssistant`: Array de SocialAssistant, pode ser nulo

### **Timeline:**
- `id`: String, não nulo
- `controlLine`: Int, não nulo
- `stage`: String, não nulo
- `deadline`: DateTime, não nulo
- `announcementId`: String, não nulo
- `announcement`: Announcement, não nulo

### **EducationLevel:**
- `id`: String, não nulo
- `level`: LevelType, não nulo
- `basicEduType`: BasicEducationType, pode ser nulo. Ciclo da educação básica (caso seja edital de educação básica)
- `scholarshipType`: ScholarshipOfferType, pode ser nulo
- `higherEduScholarshipType`: HigherEducationScholarshipType, pode ser nulo. Apenas para educação superior
- `offeredCourseType`: OfferedCourseType, pode ser nulo
- `availableCourses`: String, pode ser nulo. Qual o curso (caso seja ensino superior ou tecnico) que as vagas estão sendo ofertadas.
- `offeredVacancies`: Int, pode ser nulo. **Pode ser ignorado**
- `verifiedScholarships`: Int, pode ser nulo. Número de bolsas ofertadas para uma determinada vaga.
- `shift`: SHIFT, pode ser nulo. Turno da vaga
- `semester`: Int, pode ser nulo. Semestre da vaga (ensino superior ou tecnico)
- `grade`: String, pode ser nulo. Ciclo/Série/Ano/Grau (ensino básico)
- `announcementId`: String, não nulo
- `Application`: Array de Application, não nulo
- `announcement`: Announcement, não nulo
- `entitySubsidiary`: EntitySubsidiary, pode ser nulo
- `entitySubsidiaryId`: String, pode ser nulo

### **Application:**
- `id`: String, não nulo
- `candidate_id`: String, não nulo
- `announcement_id`: String, não nulo
- `status`: ApplicationStatus, não nulo
- `socialAssistant_id`: String, pode ser nulo
- `educationLevel_id`: String, não nulo
- `candidateName`: String, pode ser nulo
- `SocialAssistantName`: String, pode ser nulo
- `number`: Int, não nulo. Número da inscrição
- `announcement`: Announcement, não nulo
- `candidate`: Candidate, não nulo
- `EducationLevel`: EducationLevel, não nulo
- `SocialAssistant`: SocialAssistant, pode ser nulo
- `applicationHistories`: Array de ApplicationHistory, não nulo
- `ScholarshipGranted`: ScholarshipGranted, pode ser nulo

#### Indíces extras: 
- Paridade única de candidate_id e announcement_id (ou seja um candidato só pode ter uma única inscrição em um edital).
### **ApplicationHistory:**
- `id`: String, não nulo
- `application_id`: String, não nulo
- `description`: String, não nulo. Descrição da solicitação, feita no ato de criação.
- `solicitation`: SolicitationType, pode ser nulo
- `report`: String, pode ser nulo. Relatório acerca da soliticação
- `answered`: Boolean, pode ser nulo
- `deadLine`: DateTime, pode ser nulo
- `date`: DateTime, não nulo
- `application`: Application, não nulo

### **ScholarshipGranted:**
- `id`: String, não nulo
- `gaveUp`: Boolean, não nulo. Indica se o candidato desistiu da vaga.
- `ScholarshipCode`: String, pode ser nulo
- `types`: Array de scholarshipGrantedType, não nulo
- `application_id`: String, não nulo
- `announcement_id`: String, não nulo
- `announmentent`: Announcement, não nulo
- `application`: Application, não nulo

## Enum

### **ROLE**
- ADMIN
- CANDIDATE
- RESPONSIBLE
- ENTITY
- ASSISTANT
- ENTITY_SUB
- ENTITY_DIRECTOR
- SELECTION_RESPONSIBLE

### **COUNTRY**
- AC
- AL
- AM
- AP
- BA
- CE
- DF
- ES
- GO
- MA
- MG
- MS
- MT
- PA
- PB
- PE
- PI
- PR
- RJ
- RN
- RO
- RR
- RS
- SC
- SE
- SP
- TO

### **GENDER**
- MALE
- FEMALE

### **DOCUMENT_TYPE**
- DriversLicense
- FunctionalCard
- MilitaryID
- ForeignerRegistration
- Passport
- WorkCard

### **MARITAL_STATUS**
- Single
- Married
- Separated
- Divorced
- Widowed
- StableUnion

### **SkinColor**
- Yellow
- White
- Indigenous
- Brown
- Black
- NotDeclared

### **RELIGION**
- Catholic
- Evangelical
- Spiritist
- Atheist
- Other
- NotDeclared

### **SCHOLARSHIP**
- Illiterate
- ElementarySchool
- HighSchool
- CollegeGraduate
- CollegeUndergraduate
- Postgraduate
- Masters
- Doctorate
- PostDoctorate

### **EDUCATION_TYPE**
- Alfabetizacao
- Ensino_Medio
- Ensino_Tecnico
- Ensino_Superior

### **SHIFT**
- Matutino
- Vespertino
- Noturno
- Integral

### INSTITUTION_TYPE
- Public
- Private

### IncomeSource
- PrivateEmployee
- PublicEmployee
- DomesticEmployee
- TemporaryRuralEmployee
- BusinessOwnerSimplifiedTax
- BusinessOwner
- IndividualEntrepreneur
- SelfEmployed
- Retired
- Pensioner
- Apprentice
- Volunteer
- RentalIncome
- Student
- InformalWorker
- Unemployed
- TemporaryDisabilityBenefit
- LiberalProfessional
- FinancialHelpFromOthers
- Alimony
- PrivatePension

### Relationship
- Wife
- Husband
- Father
- Mother
- Stepfather
- Stepmother
- Sibling
- Grandparent
- Child
- Other

### VehicleType
- SmallCarsAndUtilities
- TrucksAndMinibuses
- Motorcycles

### VehicleSituation
- PaidOff
- Financed

### VehicleUsage
- WorkInstrument
- NecessaryDisplacement

### PropertyStatus
- OwnPaidOff
- OwnFinanced
- Rented
- ProvidedByEmployer
- ProvidedByFamily
- ProvidedOtherWay
- Irregular

### ContractType
- Verbal
- ThroughRealEstateAgency
- DirectWithOwner

### TimeLivingInProperty
- UpTo11Months
- From1To10Years
- From10To20Years
- Over20Years

### DomicileType
- House
- CondominiumHouse
- Apartment
- RoomingHouse

### NumberOfRooms
- One
- Two
- Three
- Four
- Five
- Six
- Seven
- Eight
- Nine
- Ten
- Eleven
- Twelve

### Disease
- ALIENATION_MENTAL
- CARDIOPATHY_SEVERE
- BLINDNESS
- RADIATION_CONTAMINATION
- PARKINSONS_DISEASE
- ANKYLOSING_SPONDYLITIS
- PAGETS_DISEASE
- HANSENS_DISEASE
- SEVERE_HEPATOPATHY
- SEVERE_NEPHROPATHY
- PARALYSIS
- ACTIVE_TUBERCULOSIS
- HIV_AIDS
- MALIGNANT_NEOPLASM
- TERMINAL_STAGE
- MICROCEPHALY
- AUTISM_SPECTRUM_DISORDER
- RARE_DISEASE
- OTHER_HIGH_COST_DISEASE

### ScholarshipType
- integralScholarchip
- halfScholarchip

### EmploymentType
- PrivateEmployee
- PublicEmployee
- DomesticEmployee
- TemporaryRuralEmployee
- BusinessOwnerSimplifiedTax
- BusinessOwner
- IndividualEntrepreneur
- SelfEmployed
- Retired
- Pensioner
- Apprentice
- Volunteer
- RentalIncome
- Student
- InformalWorker
- Unemployed
- TemporaryDisabilityBenefit
- LiberalProfessional
- FinancialHelpFromOthers
- Alimony
- PrivatePension

### FinancingType
- Car
- Motorcycle
- Truck
- House_Apartment_Land
- Other 

### AnnouncementType
- ScholarshipGrant
- PeriodicVerification

### LevelType
- BasicEducation
- HigherEducation

### BasicEducationType
- Preschool
- Elementary
- HighSchool
- ProfessionalEducation

### ScholarshipOfferType
- Law187ScholarshipPartial
- Law187Scholarship
- StudentWithDisabilityPartial
- StudentWithDisability
- FullTimePartial
- FullTime
- EntityWorkersPartial
- EntityWorkers

### HigherEducationScholarshipType
- PROUNIFull
- PROUNIPartial
- StateGovernment
- StateGovernmentPartial
- CityGovernment
- CityGovernmentPartial
- ExternalEntities
- ExternalEntitiesPartial
- HigherEduInstitutionFull
- HigherEduInstitutionPartial
- HigherEduInstitutionWorkers
- HigherEduInstitutionWorkersPartial
- PostgraduateStrictoSensu
- PostgraduateStrictoSensuPartial

### OfferedCourseType
- UndergraduateBachelor
- UndergraduateLicense
- UndergraduateTechnologist

### ApplicationStatus
- Approved
- Rejected
- Pending
- WaitingList

### SolicitationType
- Document
- Interview
- Visit

### ScholarshipGrantedType
- UNIFORM
- TRANSPORT
- FOOD
- HOUSING
- STUDY_MATERIAL
## Relações entre as tabelas:

### User:
- `EntityDirector`: Relação um para um, opcional.
- `EntitySubsidiary`: Relação um para um, opcional.
- `SocialAssistant`: Relação um para um, opcional.
- `Candidate`: Relação um para um, opcional.
- `Entity`: Relação um para um, opcional.
- `LegalResponsible`: Relação um para um, opcional.

### LegalResponsible:
  - `User`: Relação um para um, obrigatório.
  - `Candidate`, `FamilyMember`, `CreditCard`, `Expense`, `Financing`, `Loan`, `OtherExpense`, `Vehicle`, `FamilyMemberDisease`, `Medication`: Relações um para muitos, opcionais.

### SocialAssistant:
  - `User`, `Entity`: Relações um para um, obrigatórias.
  - `Application`, `Announcement`, `EntitySubsidiary`: Relações um para muitos, opcionais.

### Entity:
  - `User`: Relação um para um, obrigatório.
  - `Announcement`, `EntityDirector`, `EntitySubsidiary`, `SocialAssistant`: Relações um para muitos, opcionais.

### EntitySubsidiary:
  - `User`, `Entity`: Relações um para um, obrigatórias.
  - `Announcement`, `EntityDirector`, `SocialAssistant`, `EducationLevel`: Relações um para muitos, opcionais.

### EntityDirector:
  - `User`: Relação um para um, obrigatório.
  - `Entity`, `EntitySubsidiary`: Relações um para um, opcionais.

### IdentityDetails:
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### FamilyMember:
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.
  - `CreditCard`, `FamilyMemberIncome`, `Financing`, `Loan`, `MonthlyIncome`, `OtherExpense`, `FamilyMemberToVehicle`, `FamilyMemberDisease`, `Medication`: Relações um para muitos, opcionais.

### Housing:
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### Vehicle:
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.
  - `FamilyMemberToVehicle`: Relação um para muitos, opcional.

### FamilyMemberIncome:
  - `FamilyMember`: Relação um para um, opcional.
  - `Candidate`: Relação um para um, opcional.

### MonthlyIncome:
  - `FamilyMember`: Relação um para um, opcional.
  - `Candidate`: Relação um para um, opcional.
  
### Expense
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### Loan
  - `Candidate`: Relação um para um, opcional.
  - `FamilyMember`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### Financing
  - `Candidate`: Relação um para um, opcional.
  - `FamilyMember`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### CreditCard
  - `Candidate`: Relação um para um, opcional.
  - `FamilyMember`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### OtherExpense
  - `Candidate`: Relação um para um, opcional.
  - `FamilyMember`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### FamilyMemberDisease
  - `FamilyMember`: Relação um para um, opcional.
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.

### Medication
  - `FamilyMember`: Relação um para um, opcional.
  - `Candidate`: Relação um para um, opcional.
  - `LegalResponsible`: Relação um para um, opcional.
  
###  Announcement
  - `Entity`: Relação um para um, obrigatório.
  - `EntitySubsidiary`, `Application`, `EducationLevel`, `ScholarshipGranted`, `Timeline`, `SocialAssistant`: Relações um para muitos, opcionais.

### Timeline
  - `Announcement`: Relação um para um, obrigatório.

### EducationLevel
  - `Announcement`: Relação um para um, obrigatório.
  - `EntitySubsidiary`: Relação um para um, opcional.
  - `Application`: Relação um para muitos, opcional.

### Application
  - `Announcement`, `Candidate`, `EducationLevel`: Relações um para um, obrigatórias.
  - `SocialAssistant`: Relação um para um, opcional.
  - `ApplicationHistory`, `ScholarshipGranted`: Relações um para muitos, opcionais.

### ApplicationHistory
  - `Application`: Relação um para um, obrigatório.

### ScholarshipGranted
  - `Announcement`, `Application`: Relações um para um, obrigatórias.

### FamilyMemberToVehicle
  - `FamilyMember`, `Vehicle`: Relações um para um, obrigatórias.
