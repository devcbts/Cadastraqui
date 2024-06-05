import BackPageTitle from "Components/BackPageTitle";
import { useContext, useEffect, useState } from "react";
import AnnouncementContext from "../../../../context/announcementContext";
import styles from './styles.module.scss'
import FormSelect from "Components/FormSelect";
import useControlForm from "hooks/useControlForm";
import InputBase from "Components/InputBase";
import ButtonBase from "Components/ButtonBase";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import subscribeFormSchema from "./schemas/subscribe-form-schema";
import useAuth from "hooks/useAuth";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
export default function SubscriptionForm() {
    const { move, getCourse, id } = useContext(AnnouncementContext)
    const [applicants, setApplicants] = useState(null)
    const { control, formState: { isValid }, getValues } = useControlForm({
        schema: subscribeFormSchema,
        defaultValues: {
            id: null
        }
    })
    const { auth } = useAuth()
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await candidateService.getAvailableApplicants()
                setApplicants(response)
            } catch (err) {

            }
        }
        fetchApplicants()
    }, [auth])
    const handleSubscription = async () => {
        if (!isValid && auth?.role !== "CANDIDATE") return

        try {
            await candidateService.applyAnnouncement({
                announcementId: id,
                courseId: getCourse.course.id,
                candidateId: auth?.role === "CANDIDATE" ? undefined : getValues('id')
            })
            NotificationService.success({ text: 'Inscrição realizada com sucesso' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <BackPageTitle title={'dados da inscrição'} onClick={() => move('START_SUB')} />
            <div className={styles.content}>

                <div className={styles.form}>
                    {
                        auth?.role === "CANDIDATE"
                            ? <InputBase value={applicants?.name} readOnly error={null} />
                            : <FormSelect control={control} name={"id"} options={applicants} label={'candidato(a)'} />}
                    <div className={styles.formcolumns}>
                        <InputBase label="cidade" value={getCourse?.city} readOnly error={null} />
                        <InputBase label="instituição" value={getCourse?.socialReason} readOnly error={null} />
                        <InputBase label="edital" value={getCourse?.socialReason} readOnly error={null} />
                        <InputBase label="matriz ou filial" value={getCourse?.name} readOnly error={null} />
                        <InputBase label="curso" value={getCourse?.course?.availableCourses} readOnly error={null} />
                        <InputBase label="período" value={getCourse?.course?.shift} readOnly error={null} />
                        <InputBase label="semestre" value={getCourse?.course?.semester} readOnly error={null} />
                        <InputBase label="bolsa" value={SCHOLARSHIP_TYPE.find((e) => e.value === getCourse?.course?.higherEduScholarshipType)?.label} readOnly error={null} />
                    </div>
                </div>
                <ButtonBase label={'inscrever'} onClick={handleSubscription} />
            </div>
        </>
    )
}