import BackPageTitle from "Components/BackPageTitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NotificationService } from "services/notification";
import styles from './style.module.scss'
import ButtonBase from "Components/ButtonBase";
import entityService from "services/entity/entityService";
import Loader from "Components/Loader";
import InputBase from "Components/InputBase";
import FilePickerBase from "Components/FilePickerBase";
import useControlForm from "hooks/useControlForm";
import registerApplicantSchema from "./register-applicant-schema";
import FormFilePicker from "Components/FormFilePicker";
import FilePreview from "Components/FilePreview";
import { ReactComponent as User } from 'Assets/icons/user.svg'
import FormSelect from "Components/FormSelect";
import EDUCATION_STYLES from "utils/enums/education-style-types";
export default function ApplicantInformation() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState(null)
    useEffect(() => {
        if (!state.id) {
            setIsLoading(false)
            NotificationService.error({ text: 'Bolsista não encontrado' }).then(_ => {
                navigate(-1)
            })
            return
        }
        const fetchScholarship = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getScholarshipApplicantDetails(state.id)
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchScholarship()
    }, [state])
    const personalFields = [
        { field: "name", label: 'nome completo' },
        { field: "socialName", label: 'nome social' },
        { field: "CPF", label: 'CPF' },
        { field: "phone", label: 'telefone' },
        { field: "gender", label: 'sexo' },
        { field: "birthDate", label: 'data de nascimento' },
        { field: "address", label: 'endereço' },
        { field: "email", label: 'email' },
    ]
    const courseFields = [
        { field: "entityName", label: 'instituição' },
        { field: "courseName", label: 'curso' },
        { field: "isPartial", label: 'tipo de bolsa' },
        { field: "shift", label: 'turno' },
        { field: "semester", label: 'período' },
    ]
    const { control, watch, handleSubmit, getValues } = useControlForm({
        defaultValues: {
            file: null,
            type: '',
            period: '',
            modality: ''
        },
        schema: registerApplicantSchema
    })
    const handleRegister = async () => {
        try {
            const values = getValues()
            await entityService.enrollNewStudent(state.id, {
                file: values.file,
                education_style: values.modality,
                status: "REGISTERED"
            })
            NotificationService.success({ text: 'Candidato matriculado' }).then(_ => navigate(-1))
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.photo}>
                        {data?.personalInfo?.url
                            ? <img src={data?.personalInfo?.url}></img>
                            : <User />
                        }

                    </div>
                    <div className={styles.actions}>
                        {/* <ButtonBase label={'ficha completa'} onClick={() => { }} /> */}
                        <ButtonBase label={'documentos enviados'} onClick={() => {
                            navigate('', { state: { ...state, documents: true } })
                        }} />
                    </div>
                </div>
                <div className={styles.information}>
                    <h2>Dados pessoais</h2>
                    {Object.entries(data?.personalInfo ?? {}).map(([k, v]) => {
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
                    <h2>Matrícula</h2>
                    {Object.entries(data?.scholarshipInfo ?? {}).map(([k, v]) => {
                        const currField = courseFields.find(e => k === e.field)
                        if (!currField || !v) { return null }
                        return (
                            <div>
                                <h4>{currField.label}</h4>
                                <InputBase error={null} value={v} key={k} disabled />
                            </div>
                        )
                    })}
                    {/* <div>
                        <h4>Ciclo de matrícula</h4>
                        <FormSelect control={control} name={"type"} options={[]} />
                    </div> */}
                    {/* <div>
                        <h4>Período</h4>
                        <FormSelect control={control} name={"period"} options={[]} />
                    </div> */}
                    <div>
                        <h4>Modalidade de ensino</h4>
                        <FormSelect control={control} name={"modality"} options={EDUCATION_STYLES} value={watch("modality")} />
                    </div>
                </div>
                <div className={styles.information}>
                    <h2>Upload de documentos</h2>
                    <FormFilePicker control={control} name="file" label={'histórico escolar ou comprovante de conclusão de curso'} accept={'application/pdf'} />
                    <FilePreview text={'visualizar documento'} file={watch("file")} />
                </div>
                <ButtonBase label={'matricular'} onClick={handleSubmit(handleRegister)} />
            </div>
        </>
    )
}