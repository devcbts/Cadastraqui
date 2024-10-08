
// async function updateEducationLevelScholarshipType() {
//     try {
//         // Buscar todos os registros na tabela EducationLevel
//         const educationLevels = await prisma.educationLevel.findMany({
//             where: {
//                 OR: [{ scholarshipType: { not: null } }, { higherEduScholarshipType: { not: null } }]
//             }
//         });

//         for (const educationLevel of educationLevels) {
//             const { scholarshipType, higherEduScholarshipType } = educationLevel;

//             // Determinar o tipo de bolsa a ser inserido no campo typeOfScholarship
//             const typeOfScholarship = scholarshipType || higherEduScholarshipType;

//             if (typeOfScholarship) {
//                 // Atualizar o campo typeOfScholarship na tabela EducationLevel
//                 await prisma.educationLevel.update({
//                     where: { id: educationLevel.id },
//                     data: { typeOfScholarship: typeOfScholarship }
//                 });
//                 console.log(`EducationLevel ${educationLevel.id} atualizado com typeOfScholarship ${typeOfScholarship}`);
//             } else {
//                 console.log(`Tipo de bolsa não encontrado para EducationLevel ${educationLevel.id}`);
//             }
//         }

//         console.log("Todos os registros de EducationLevel foram atualizados com sucesso.");
//     } catch (error) {
//         console.error("Erro ao atualizar EducationLevel:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// // Executar o script
// updateEducationLevelScholarshipType();