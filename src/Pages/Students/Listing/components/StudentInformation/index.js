import BackPageTitle from "Components/BackPageTitle";
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import InputBase from "Components/InputBase";
import { useNavigate, useParams } from "react-router";
import { NotificationService } from "services/notification";
import entityService from "services/entity/entityService";
import Table from "Components/Table";
import Loader from "Components/Loader";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as User } from 'Assets/icons/user.svg'
import studentService from "services/student/studentService";

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
    const personalFields = [
        { field: "name", label: 'nome completo' },
        { field: "socialName", label: 'nome social' },
        { field: "CPF", label: 'CPF' },
        { field: "birthDate", label: 'data de nascimento' },
        { field: "gender", label: 'sexo' },
        { field: "phone", label: 'telefone' },
        { field: "address", label: 'endereço' },
        { field: "email", label: 'email' },
    ]
    const courseFields = [
        { field: "entity", label: 'instituição' },
        { field: "course", label: 'curso' },
        { field: "isPartial", label: 'tipo de bolsa' },
        { field: "shift", label: 'turno' },
        { field: "modality", label: 'modalidade de ensino' },
        { field: "semester", label: 'período' },
        { field: "status", label: 'status' },
    ]
    const documentFields = [
        { field: "isUpdated", label: 'status' },
        { field: "lastUpdate", label: 'última atualização' },
    ]
    const scholarshipFields = [
        { field: "isPartial", label: 'Tipo de bolsa' },
        { field: "admission", label: 'data de concessão' },
        { field: "scholarshipType", label: 'Motivo da bolsa' },
        { field: "scholarshipStatus", label: 'status da bolsa' },
        { field: "renewStatus", label: 'status da renovação' },
    ]
    const incomeFields = [
        { field: "averageIncome", label: 'Renda média familiar' },
        { field: "expenses", label: 'Despesas' },
        { field: "status", label: 'Status da renda' },
    ]
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
        navigate(page, { state: { id: data?.personalInfo?.candidate_id } })
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
                <div className={styles.information}>
                    <h2>Dados pessoais</h2>
                    {Object.entries(data?.personalInfo).map(([k, v]) => {
                        const currField = personalFields.find(e => k === e.field)
                        if (!currField) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.information}>
                    <h2>Dados acadêmicos</h2>
                    {Object.entries(data?.courseInfo).map(([k, v]) => {
                        const currField = courseFields.find(e => k === e.field)
                        if (!currField) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.information}>
                    <h2>Documentos</h2>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <ButtonBase label={'documentos enviados'} onClick={() => handlePageChange("documentos")} />
                    </div>
                    {Object.entries(data?.documentInfo).map(([k, v]) => {
                        const currField = documentFields.find(e => k === e.field)
                        if (!currField) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.information}>
                    <h2>Dados da bolsa</h2>
                    {Object.entries(data?.scholarshipInfo).map(([k, v]) => {
                        const currField = scholarshipFields.find(e => k === e.field)
                        if (!currField) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.information}>
                    <h2>Dados socioeconômicos</h2>
                    {Object.entries(data?.incomeInfo).map(([k, v]) => {
                        const currField = incomeFields.find(e => k === e.field)
                        if (!currField) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}

                    <Table.Root headers={2} title={'Grupo familiar'}>
                        {data?.familyInfo.map((e, i) => (
                            <Table.Row>
                                <Table.Cell divider>{++i}</Table.Cell>
                                <Table.Cell>{e.fullName}</Table.Cell>
                            </Table.Row>

                        ))}
                    </Table.Root>
                </div>
                <div className={styles.information}>
                    <h2>Dados adicionais</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', placeContent: 'flex-start', width: 'fit-content' }}>
                        <ButtonBase label={'Renovações anteriores'} onClick={() => handlePageChange("renovacoes")} />
                        <ButtonBase label={'Histórico de entrevistas'} onClick={() => handlePageChange("entrevistas")} />
                    </div>
                </div>
            </div >
        </>
    )
}