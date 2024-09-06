import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import Loader from "Components/Loader";
import CANDIDATE_APPLICATION_STATUS from "utils/enums/candidate-application-status";
export default function AllCandidatesBenefitsTypeTwo() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { courseId } = state
    const [isLoading, setIsLoading] = useState(true)
    const [students, setStudents] = useState([])
    useEffect(() => {
        const fetchAvailableStudents = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getGrantedScholarshipsByCourse(courseId)
                setStudents(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchAvailableStudents()
    }, [courseId])
    return (
        <>
            <Loader loading={isLoading} />
            <Table.Root headers={['rank', 'candidato', 'condição', 'ação']}>
                {
                    students.map(e => {
                        const { candidateStatus, position, id } = e.application
                        return (
                            <Table.Row key={e.id}>
                                <Table.Cell divider>{position}</Table.Cell>
                                <Table.Cell >{e.candidateName}</Table.Cell>
                                <Table.Cell>{CANDIDATE_APPLICATION_STATUS[candidateStatus]}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase onClick={() => navigate('', { state: { ...state, scholarshipId: e.id, applicationId: id } })}>
                                        <Magnifier width={15} height={15} />
                                    </ButtonBase>
                                </Table.Cell>

                            </Table.Row>
                        )
                    })
                }
            </Table.Root>
        </>
    )
}