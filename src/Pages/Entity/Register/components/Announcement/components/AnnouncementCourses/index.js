import useControlForm from "hooks/useControlForm"
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import { useFieldArray, useWatch } from "react-hook-form"
import Table from "Components/Table"
import announcementCoursesSchema from "./schemas/announcement-courses-schema"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import FormSelect from "Components/FormSelect"
import SCHOOL_LEVELS from "utils/enums/school-levels"
import SHIFT from "utils/enums/shift-types"
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer"
import InputForm from "Components/InputForm"
import GRADE_LEVELS from "utils/enums/grade-levels"
import findLabel from "utils/enums/helpers/findLabel"
import OFFERED_COURSES_TYPE from "utils/enums/offered-courses"
import cursos from 'objects/cursos.json'
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type"
import EDUCATION_TYPE from "utils/enums/education-type"
import { NotificationService } from "services/notification"
import { api } from "services/axios"
import entityService from "services/entity/entityService"
import { Link } from "react-router-dom"
import basicTemplate from 'Assets/templates/Vagas_Basico_Cadastraqui.xlsx'
import higherTemplate from "Assets/templates/Vagas_Superior_Cadastraqui.xlsx"
import CoursesResumeBoard from "../CoursesResumeBoard"
import useTutorial from "hooks/useTutorial"
import ANNOUNCEMENT_TUTORIALS from "utils/enums/tutorials/announcement"
import Tooltip from "Components/Tooltip"
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
export default function AnnouncementCourses({ entity, allCourses, data, onPageChange }) {
    // can be 'HigherEducation' or 'BasicEducation'
    const { control, formState: { isValid }, setValue, trigger, getValues, watch, reset, resetField } = useControlForm({
        schema: announcementCoursesSchema,
        defaultValues: {
            level: data?.educationLevel,
            typeOfScholarship: null,
            verifiedScholarships: 0,
            type: null,
            name: '',
            id: null,
            shift: "",
            semester: 0,
            entity_subsidiary_id: undefined,
        },
        initialData: {
            level: data?.educationLevel
        }
    })
    const isBasicEducation = watch("level") === "BasicEducation"
    useTutorial(ANNOUNCEMENT_TUTORIALS.CREATE.Courses)
    const [courses, setCourses] = useState(data?.educationalLevels ?? [])
    const [totalScholarships, setTotalScholarships] = useState(0)
    const handleAddCourse = () => {
        if (!isValid) {
            trigger()
            return
        }
        const data = getValues()
        let mappedData = { _identifier: new Date().getTime(), ...data, shift: findLabel(SHIFT, data.shift) }
        // if (!data.entity_subsidiary_id) {
        //     mappedData.entity_subsidiary_id = entity.id
        // }
        setCourses((prev) => ([...prev, mappedData]))
        reset()
    }

    const entitiesOptions = useMemo(() => {
        const subs = entity?.EntitySubsidiary?.map((e) => ({ label: e.socialReason, value: e.id }))
        subs?.push({ label: entity?.socialReason, value: null })
        return subs
    }, [entity])


    useEffect(() => {
        const total = courses.reduce((acc, value) => {
            return acc += Number(value.verifiedScholarships)
        }, 0)
        setTotalScholarships(total)
    }, [courses])

    const handleSubmit = () => {
        onPageChange(1, { educationalLevels: courses, verifiedScholarships: totalScholarships, entity_subsidiary_id: courses.map(e => e.entity_subsidiary_id).filter(e => !!e) })
    }
    const handleRemoveCourse = (identifier) => {
        setCourses((prev) => (prev.filter((e) => e._identifier !== identifier)))

    }
    const fileRef = useRef(null)
    const handleUploadCsv = async (e) => {
        const { files } = e.target
        const file = files?.[0]
        if (!file) { return }
        try {
            const formData = new FormData()
            formData.append("file", file)
            let information
            if (isBasicEducation) {
                information = await entityService.uploadAnnouncementCsvBasic(formData)
            } else {
                information = await entityService.uploadAnnouncementCsvHigher(formData)
            }
            setCourses((prev) => ([...prev, ...information?.map((e, i) => ({
                ...e,
                level: data?.educationLevel,
                _identifier: new Date().getTime() + i
            }))]))

        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const courseType = watch("type")
    const courseId = watch("id")
    const courseName = watch("name")

    const handleChangeCourse = (id) => {
        setValue("name", allCourses.find(e => e.id === id)?.name)
    }
    return (
        <>
            <BackPageTitle title={'Cadastrar Curso'} onClick={() => onPageChange(-1)} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                    <Tooltip tooltip={'Anexar a planilha VAGAS no formato .csv'} Icon={Help}>
                        Preencher por planilha ({findLabel(EDUCATION_TYPE, data?.educationLevel)})

                    </Tooltip>
                    <a
                        download={isBasicEducation ? 'Modelo_Basico' : 'Modelo_Superior'}
                        href={isBasicEducation ? basicTemplate : higherTemplate} >
                        <ButtonBase label={'baixar modelo'} />
                    </a>
                    <input hidden ref={fileRef} onChange={handleUploadCsv} type="file" accept=".csv" />
                    <ButtonBase label={'enviar'} onClick={() => fileRef.current?.click()} />
                </div>
                <div style={{ width: 'max(400px, 50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                    <FormSelect label={'matriz ou filial'} control={control} name="entity_subsidiary_id" options={entitiesOptions} value={watch("entity_subsidiary_id")} />

                    <FormSelect
                        label={isBasicEducation ? 'tipo de educação básica' : 'tipo de curso oferecido'}
                        name="type"
                        control={control}
                        options={isBasicEducation ? SCHOOL_LEVELS : OFFERED_COURSES_TYPE}
                        value={courseType}
                        onChange={() => {
                            resetField("id")
                            resetField("name")
                        }}
                    />


                    {(courseType === 'Postgraduate' || courseType === "ProfessionalEducation")
                        ? <InputForm control={control} label={isBasicEducation ? "ciclo/ano/série/curso" : "curso"} name="name" />
                        : <FormSelect
                            label={'curso'}
                            control={control}
                            name="id"
                            options={allCourses.filter(e => e.Type === courseType).map(e => ({ value: e.id, label: e.name }))}
                            value={courseId}
                            onChange={handleChangeCourse}
                        />}



                    <FormSelect label={'turno'} control={control} name="shift" options={SHIFT} value={watch("shift")} />

                    <FormSelect label={isBasicEducation ? 'tipo de bolsa' : 'tipo de bolsa do ensino superior'}
                        control={control}
                        name="typeOfScholarship"
                        options={isBasicEducation ? SCHOLARSHIP_OFFER : SCHOLARSHIP_TYPE}
                        value={watch("typeOfScholarship")} />


                    <InputForm label={'número de bolsas'} control={control} name="verifiedScholarships" transform={(e) => {
                        if (!isNaN(parseInt(e.target.value))) {
                            return parseInt(e.target.value, 10)
                        }
                        return 0
                    }} />
                    {!isBasicEducation && <InputForm control={control} label={'semestre'} name='semester' transform={(e) => {
                        if (!isNaN(parseInt(e.target.value))) {
                            const value = parseInt(e.target.value, 10)
                            return value > 2 ? 2 : 1
                        }
                        return 1
                    }} />}
                </div>
                <ButtonBase label={'cadastrar vaga'} onClick={handleAddCourse} />
                <div style={{ display: 'flex', flexDirection: 'column', placeContent: 'center' }}>
                    <CoursesResumeBoard
                        headers={['matriz ou filial', 'vagas', 'tipo de educação', 'ciclo/ano/série/semestre/curso', 'turno', 'tipo de bolsa']}
                        onRemove={(course) => handleRemoveCourse(course.id)}
                        courses={courses.map(e => ({
                            id: e._identifier,
                            1: findLabel(entitiesOptions, e.entity_subsidiary_id),
                            2: e.verifiedScholarships,
                            3: findLabel(EDUCATION_TYPE, e.level),
                            4: e.name,
                            5: e.shift,
                            6: findLabel(SCHOLARSHIP_OFFER.concat(SCHOLARSHIP_TYPE), e.typeOfScholarship) ?? e.typeOfScholarship
                        }))}
                    />

                    <ButtonBase label={'próximo'} style={{ marginTop: '24px' }} onClick={handleSubmit} />
                </div>
            </div>
        </>
    )
}

// {
//     !isBasicEducation &&
//     (
//         watch("offeredCourseType") === 'Postgraduate'
//             ? <InputForm control={control} label="curso" name="availableCourses" />
//             : <FormSelect label={'curso'} control={control} name="availableCourses" options={coursesList} value={watch("availableCourses")} />
//     )
// }
// {isBasicEducation && (
//     watch("basicEduType") === "ProfessionalEducation"
//         ? <InputForm control={control} label={'ciclo/ano/série/curso'} name="grade" />
//         : <FormSelect label={'ciclo/ano/série/curso'} control={control} name="grade" options={gradeOptions} value={watch("grade")} />
// )
// }
// <FormSelect label={'turno'} control={control} name="shift" options={SHIFT} value={watch("shift")} />
// {
//     isBasicEducation
//         ? <FormSelect label={'tipo de bolsa'} control={control} name="scholarshipType" options={SCHOLARSHIP_OFFER} value={watch("scholarshipType")} />
//         : <FormSelect label={'tipo de bolsa do ensino superior'} control={control} name="higherEduScholarshipType" options={SCHOLARSHIP_TYPE} value={watch("higherEduScholarshipType")} />

// }
// <InputForm label={'número de bolsas'} control={control} name="verifiedScholarships" transform={(e) => {
//     if (!isNaN(parseInt(e.target.value))) {
//         return parseInt(e.target.value, 10)
//     }
//     return 0
// }} />
// {!isBasicEducation && <InputForm control={control} label={'semestre'} name='semester' transform={(e) => {
//     if (!isNaN(parseInt(e.target.value))) {
//         const value = parseInt(e.target.value, 10)
//         return value > 2 ? 2 : 1
//     }
//     return 1
// }} />}
// </div>
// <ButtonBase label={'cadastrar vaga'} onClick={handleAddCourse} />
// <div>
// <h2>Quadro resumo</h2>

// <Table.Root headers={['matriz ou filial', 'vagas', 'tipo de educação', 'ciclo/ano/série/semestre/curso', 'turno', 'tipo de bolsa', 'ação']}>
//     {
//         courses.map(course => (
//             <Table.Row key={course._identifier}>
//                 <Table.Cell>{findLabel(entitiesOptions, course.entity_subsidiary_id)}</Table.Cell>
//                 <Table.Cell>{course.verifiedScholarships}</Table.Cell>
//                 {/* <Table.Cell>{isBasicEducation ? findLabel(SCHOOL_LEVELS, course.basicEduType) : findLabel(EDUCATION_TYPE, course.level)}</Table.Cell> */}
//                 <Table.Cell>{findLabel(EDUCATION_TYPE, course.level)}</Table.Cell>
//                 <Table.Cell>{course.grade ?? course.availableCourses}</Table.Cell>
//                 <Table.Cell>{course.shift}</Table.Cell>
//                 <Table.Cell>{
//                     isBasicEducation ?
//                         findLabel(SCHOLARSHIP_OFFER, course.scholarshipType)
//                         : findLabel(SCHOLARSHIP_TYPE, course.higherEduScholarshipType)
//                 }</Table.Cell>
//                 <Table.Cell>
//                     <ButtonBase label={'excluir'} onClick={() => { handleRemoveCourse(course._identifier) }} danger />
//                 </Table.Cell>
//             </Table.Row>
//         ))
//     }
// </Table.Root>
// </div>