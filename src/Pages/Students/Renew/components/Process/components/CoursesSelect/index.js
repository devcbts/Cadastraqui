import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import SelectTable from "../SelectTable";
import SHIFT from "utils/enums/shift-types";
import { useEffect, useMemo, useState } from "react";
import ButtonBase from "Components/ButtonBase";
import SelectBase from "Components/SelectBase";
import InputBase from "Components/InputBase";
import SelectInput from "../SelectInput";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import { NotificationService } from "services/notification";

export default function EntityStudentsRenewProcessCoursesSelect({ data, courses, units, onSubmit }) {
    const [filters, setFilters] = useState(data?.filters ?? {})
    const [selectedCourses, setSelectedCourses] = useState([])
    const [verifiedScholarships, setVerifiedScholarships] = useState(0)
    const handleChangeFilters = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }))
    }
    const [showCourses, setShowCourses] = useState(courses)
    useEffect(() => {
        setShowCourses(() => {
            const arr = [...courses]
            return arr.filter(e => {
                const entity = filters.units?.includes(e.entity)
                const shift = filters.shifts?.includes(e.shift)
                return entity && shift
            })
        })
    }, [filters])
    useEffect(() => {
        setVerifiedScholarships(selectedCourses.reduce((acc, curr) => {
            const value = Number(curr.verifiedScholarships)
            const toSum = isNaN(value) ? 0 : value
            return acc += toSum
        }, 0))
    }, [selectedCourses])
    const isBasicEducation = data.educationType === "BasicEducation"

    const handleSubmit = () => {

        // if (selectedCourses.length === 0) {
        //     return NotificationService.error({ text: 'Selecione ao menos um curso' })
        // }
        onSubmit({ filters, selectedCourses, verifiedScholarships })
    }
    const getCurrentFormState = useMemo(() => {
        if (selectedCourses.length === 0) {
            return false
        }
        const scholarshipValidation = (e) => !!e.scholarshipType && !!Number(e.verifiedScholarships)
        const semesterValidation = (e) => !!Number(e.semester)
        return selectedCourses.every(e => {
            if (isBasicEducation) {
                return scholarshipValidation(e)
            } else {
                return semesterValidation(e) && scholarshipValidation(e)
            }
        })
    }, [selectedCourses])
    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1' }}>
            <h3>{findLabel(EDUCATION_TYPE, data?.educationType)}</h3>
            <SelectTable headers={['turno']}

                onSelect={(v, ids) => {
                    handleChangeFilters("shifts", ids)
                }}
                defaultSelected={filters?.shifts}
            >
                {
                    SHIFT.map(e => ({
                        id: e.label,
                        cells: [e.label]
                    }))
                }
            </SelectTable>
            <SelectTable headers={['unidade']}

                onSelect={(v, ids) => {
                    handleChangeFilters("units", ids)
                }}
                defaultSelected={filters?.units}
            >
                {
                    units.map(e => ({
                        id: e.value,
                        cells: [e.label]
                    }))
                }
            </SelectTable>
            <SelectTable headers={['curso', 'turno', 'bolsas necessárias', isBasicEducation ? null : 'semestre', 'qtd. bolsas']}
                onSelect={(v) => {
                    const selectedData = v.map(e => {
                        const { raw, cells } = e
                        const [course, shift] = cells
                        return ({
                            id: e.id,
                            verifiedScholarships: e?.["input-scholarship"],
                            scholarshipType: e?.["select-scholarship"]?.value,
                            shift,
                            courseId: raw.course_id,
                            course: course,
                            type: raw.type,
                            semester: e?.["input-semester"] ?? "",
                            entity: raw.isMatrixCourse ? null : raw.entity,
                        })
                    })
                    setSelectedCourses(selectedData)
                    handleChangeFilters("courses", v)
                }}
                defaultSelected={filters?.courses}
            >
                {
                    showCourses.map(e => ({
                        id: `${e.id}.${e.shift}`,
                        raw: e,
                        cells: [e.course, e.shift, e.current_scholarships,
                        (!isBasicEducation ? {
                            type: "input",
                            name: "semester",

                        } : null),
                        {
                            type: "both",
                            name: "scholarship",
                            options: SCHOLARSHIP_OFFER
                        },

                        ],
                    }))
                }
            </SelectTable>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', placeSelf: 'end' }}>
                <h3>Total de bolsas</h3>
                <h3 style={{ border: '1px solid transparent', borderRadius: '12px', backgroundColor: '#1F4B73', padding: '12px', minWidth: '50px', textAlign: 'center', color: 'white' }}>

                    {verifiedScholarships}
                </h3>
            </div>
            {getCurrentFormState && <ButtonBase label={'Próximo'} onClick={handleSubmit} />}
        </div>
    )
}