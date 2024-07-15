import useControlForm from "hooks/useControlForm"
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import { useFieldArray } from "react-hook-form"
import Table from "Components/Table"
import announcementCoursesSchema from "./schemas/announcement-courses-schema"
import { useCallback, useEffect, useMemo, useState } from "react"
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
export default function AnnouncementCourses({ entity, data, onPageChange }) {
    // can be 'HigherEducation' or 'BasicEducation'
    const isBasicEducation = data?.educationLevel === 'BasicEducation'
    const { control, formState: { isValid, errors }, trigger, getValues, watch, reset } = useControlForm({
        schema: announcementCoursesSchema(isBasicEducation),
        defaultValues: {
            level: data?.educationLevel,
            basicEduType: null,
            scholarshipType: null,
            higherEduScholarshipType: null,
            offeredCourseType: null,
            availableCourses: null,
            offeredVacancies: 0,
            verifiedScholarships: 0,
            shift: "",
            grade: null,
            semester: undefined,
            entity_subsidiary_id: undefined,
        }
    })
    const [courses, setCourses] = useState(data?.educationalLevels ?? [])
    const [totalScholarships, setTotalScholarships] = useState(0)
    const handleAddCourse = () => {
        if (!isValid) {
            trigger()

            return
        }
        const data = getValues()
        let mappedData = { ...data, shift: findLabel(SHIFT, data.shift) }
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
    const gradeOptions = useMemo(() => {
        return GRADE_LEVELS[watch("basicEduType")]?.map(grade => ({ value: grade, label: grade }))
    }, [watch("basicEduType")])

    const coursesList = useMemo(() => {
        const value = watch("offeredCourseType")
        let list;
        if (value === 'UndergraduateBachelor') list = cursos.bacharelado
        if (value === 'UndergraduateLicense') list = cursos.licenciatura
        if (value === 'UndergraduateTechnologist') list = cursos.tecnologos
        return list?.map(e => ({ label: e, value: e }))
    }, [watch("offeredCourseType")])

    useEffect(() => {
        const total = courses.reduce((acc, value) => {
            return acc += Number(value.verifiedScholarships)
        }, 0)
        setTotalScholarships(total)
    }, [courses])

    const handleSubmit = () => {
        onPageChange(1, { educationalLevels: courses, verifiedScholarships: totalScholarships, entity_subsidiary_id: courses.map(e => e.entity_subsidiary_id).filter(e => !!e) })
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <BackPageTitle title={'Cadastrar Curso'} onClick={() => onPageChange(-1)} />
            <div style={{ width: 'max(400px, 50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                <FormSelect label={'matriz ou filial'} control={control} name="entity_subsidiary_id" options={entitiesOptions} value={watch("entity_subsidiary_id")} />
                {
                    isBasicEducation
                        ? <FormSelect label={'tipo de educação básica'} control={control} name="basicEduType" options={SCHOOL_LEVELS} value={watch("basicEduType")} />
                        : <FormSelect label={'tipo de curso oferecido'} control={control} name="offeredCourseType" options={OFFERED_COURSES_TYPE} value={watch("offeredCourseType")} />
                }
                {
                    !isBasicEducation &&
                    (
                        watch("offeredCourseType") === 'Postgraduate'
                            ? <InputForm control={control} label="curso" name="availableCourses" />
                            : <FormSelect label={'curso'} control={control} name="availableCourses" options={coursesList} value={watch("availableCourses")} />
                    )
                }
                {isBasicEducation && (
                    watch("basicEduType") === "ProfessionalEducation"
                        ? <InputForm control={control} label={'ciclo/ano/série/curso'} name="grade" />
                        : <FormSelect label={'ciclo/ano/série/curso'} control={control} name="grade" options={gradeOptions} value={watch("grade")} />
                )
                }
                <FormSelect label={'turno'} control={control} name="shift" options={SHIFT} value={watch("shift")} />
                {
                    isBasicEducation
                        ? <FormSelect label={'tipo de bolsa'} control={control} name="scholarshipType" options={SCHOLARSHIP_OFFER} value={watch("scholarshipType")} />
                        : <FormSelect label={'tipo de bolsa do ensino superior'} control={control} name="higherEduScholarshipType" options={SCHOLARSHIP_TYPE} value={watch("higherEduScholarshipType")} />

                }
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
            <div>
                <h1>Quadro resumo</h1>
                <Table.Root headers={['matriz ou filial', 'vagas', 'tipo de educação', 'ciclo/ano/série/semestre/curso', 'turno', 'tipo de bolsa']}>
                    {
                        courses.map(course => (
                            <Table.Row>
                                <Table.Cell>{findLabel(entitiesOptions, course.entity_subsidiary_id)}</Table.Cell>
                                <Table.Cell>{course.verifiedScholarships}</Table.Cell>
                                <Table.Cell>{findLabel(SCHOOL_LEVELS, course.basicEduType)}</Table.Cell>
                                <Table.Cell>{course.grade}</Table.Cell>
                                <Table.Cell>{findLabel(SHIFT, course.shift)}</Table.Cell>
                                <Table.Cell>{
                                    isBasicEducation ?
                                        findLabel(SCHOLARSHIP_OFFER, course.scholarshipType)
                                        : findLabel(SCHOLARSHIP_TYPE, course.higherEduScholarshipType)
                                }</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}