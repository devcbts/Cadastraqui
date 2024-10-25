import BackPageTitle from "Components/BackPageTitle";
import styles from './styles.module.scss'
import { useCallback, useEffect, useState } from "react";
import InputBase from "Components/InputBase";
import { useNavigate, useParams } from "react-router";
import { NotificationService } from "services/notification";
import entityService from "services/entity/entityService";
import Table from "Components/Table";
import Loader from "Components/Loader";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as User } from 'Assets/icons/user.svg'
import studentService from "services/student/studentService";
import TextEditor from "Components/TextEditor";
import debounce from "lodash.debounce";
import useAuth from "hooks/useAuth";
import FilePickerBase from "Components/FilePickerBase";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
import { v4 as uuidv4 } from 'uuid'
import StudentDocumentSection from "Components/Students/Sections/StudentDocumentSection";
import StudentPersonalSection from "Components/Students/Sections/StudentPersonalSection";
import StudentScholarshipSection from "Components/Students/Sections/StudentScholarshipSection";
import StudentIncomeSection from "Components/Students/Sections/StudentIncomeSection";
import StudentAcademicSection from "Components/Students/Sections/StudentAcademicSection";
export default function StudentListInformation() {
    const { studentId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [data, setData] = useState({
        personalInfo: {},
        scholarshipInfo: {},
        courseInfo: {},
        incomeInfo: {},
        documentInfo: {},
        familyInfo: []
    })




    useEffect(() => {
        const fetchStudent = async () => {
            setIsLoading(true)
            try {
                const information = await studentService.getStudentInformation(studentId)
                console.log(information)
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message }).then(_ => {
                    navigate(-1)
                })
            }
            setIsLoading(false)
        }
        fetchStudent()
    }, [studentId])
    const handlePageChange = (page) => {
        navigate(page, { state: { candidateId: data?.personalInfo?.candidate_id } })
    }

    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={-1} title={'Ficha do aluno'} />
            <div className={styles.container}>
                <div className={styles.photo}>
                    {data?.personalInfo?.url
                        ? <img src={data?.personalInfo?.url}></img>
                        : <User />
                    }

                </div>
                <StudentPersonalSection data={data?.personalInfo} />
                <StudentAcademicSection data={data?.courseInfo} />
                <StudentScholarshipSection data={data?.scholarshipInfo} />
                <StudentDocumentSection
                    studentId={studentId}
                    candidateId={data?.personalInfo?.candidate_id}
                    data={data?.documentInfo} />
                <StudentIncomeSection
                    income={data?.incomeInfo}
                    family={data?.familyInfo}
                />

                <div className={styles.information}>
                    <h2>Dados adicionais</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', placeContent: 'flex-start', width: 'fit-content' }}>
                        <ButtonBase label={'Renovações anteriores'}
                            style={{ placeSelf: 'flex-start' }}
                            onClick={() => handlePageChange("renovacoes")} />
                        <ButtonBase label={'Histórico de entrevistas'}
                            style={{ placeSelf: 'flex-start' }}
                            onClick={() =>
                                handlePageChange("entrevistas")} />
                    </div>
                </div>
            </div >
        </>
    )
}