import BackPageTitle from "Components/BackPageTitle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { NotificationService } from "services/notification";
import CardsRow from "./components/CardRow";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function AssistantManagerSelectedCourse() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    useEffect(() => {
        if (!courseId) {
            NotificationService.error({ text: 'Curso não encontrado' }).then(() => navigate(-1))
        }
        const fetchCourse = async () => {
            try {
                const information = await socialAssistantService.getAdminCourseInfo(courseId)
                setCourse(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        fetchCourse()
    }, [courseId])
    return (
        <>
            <BackPageTitle title={'Gerencial Administrativo'} path={-1} />
            <div style={{ padding: '32px 24px 0px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1, gap: '32px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ flexBasis: '30%' }}>Instituição: {course?.entity?.socialReason}</label>
                    <label style={{ flexBasis: '30%' }}>Vagas: {course?.vacancies}</label>
                    <label style={{ flexBasis: '30%' }}>Inscritos: {course?.applicants}</label>
                    <label style={{ flexBasis: '100%' }}>Endereço: {`${course?.entity?.address}, Nº ${course?.entity?.addressNumber}. ${course?.entity?.city} - ${course?.entity?.UF}`}</label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <CardsRow
                        title={'Visão quantitativa - Fase inicial do processo seletivo'}
                        cards={[
                            { desc: 'Vagas', value: course?.vacancies },
                            { desc: 'Candidatos', value: course?.applicants },
                            { desc: 'Para análise Ass. Social', value: course?.notAnalysed },
                            { desc: 'Fila de Espera', value: course?.waitingList },
                        ]}
                    />
                    <CardsRow
                        title={'Visão quantitativa - Análise do perfil sócio econômico'}
                        cards={[
                            { desc: 'Aguardando Entrevista', value: course?.interview },
                            { desc: 'Aguardando visita domiciliar', value: course?.visit },
                            { desc: 'Solicitado novos docs.', value: course?.docRequests },
                            { desc: 'Em análise pela Ass.Social ', value: course?.waitingAnalysis },
                        ]}
                    />
                    <CardsRow
                        title={'Visão quantitativa - Conclusão do processo seletivo'}
                        cards={[
                            { desc: 'Deferidos', value: course?.approved },
                            { desc: 'Indeferidos', value: course?.reproved },
                            { desc: 'Fila de Espera', value: course?.waitingList },
                        ]}
                    />

                </div>
                {/* <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20%' }}>
                    <ButtonBase >
                        <Excel height={30} width={30} />
                    </ButtonBase>
                    <ButtonBase >
                        <PDF height={30} width={30} />
                    </ButtonBase>
                </div> */}
            </div>
        </>
    )
}