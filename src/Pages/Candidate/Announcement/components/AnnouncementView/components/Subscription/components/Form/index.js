import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FormSelect from "Components/FormSelect";
import InputBase from "Components/InputBase";
import useAuth from "hooks/useAuth";
import useControlForm from "hooks/useControlForm";
import { useContext, useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import AnnouncementContext from "../../../../context/announcementContext";
import subscribeFormSchema from "./schemas/subscribe-form-schema";
import styles from './styles.module.scss';
export default function SubscriptionForm() {
    const { move, getCourse, id, announcement } = useContext(AnnouncementContext)
    const [applicants, setApplicants] = useState([])
    const { control, formState: { isValid }, getValues, trigger, watch } = useControlForm({
        schema: subscribeFormSchema,
        defaultValues: {
            id: ""
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
        if (!isValid && auth?.role !== "CANDIDATE") {
            trigger()
            return
        }

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
            <BackPageTitle title={'Dados da inscrição'} onClick={() => move('START_SUB')} />
            <div className={styles.content}>
                <div className={styles.form}>
                    {
                        auth?.role === "CANDIDATE"
                            ? <InputBase value={applicants?.name} readOnly error={null} />
                            : <FormSelect control={control} name={"id"} options={applicants} label={'candidato(a)'} value={watch("id")} />}
                    <div className={styles.formcolumns}>
                        <InputBase label="cidade" value={getCourse?.city} readOnly error={null} />
                        <InputBase label="instituição" value={announcement?.entity?.socialReason} readOnly error={null} />
                        <InputBase label="edital" value={announcement?.announcementName} readOnly error={null} />
                        <InputBase label="matriz ou filial" value={getCourse?.socialReason} readOnly error={null} />
                        <InputBase label="curso/série" value={getCourse?.course?.course?.name} readOnly error={null} />
                        <InputBase label="período" value={getCourse?.course?.shift} readOnly error={null} />
                        {/* <InputBase label="semestre" value={getCourse?.course?.semester} readOnly error={null} /> */}
                        <InputBase label="bolsa" value={
                            findLabel(SCHOLARSHIP_TYPE, getCourse?.course?.typeOfScholarship) ??
                            findLabel(SCHOLARSHIP_OFFER, getCourse?.course?.typeOfScholarship)
                        } readOnly error={null} />
                    </div>
                </div>
                <ButtonBase label={'inscrever'} onClick={handleSubscription} />
            </div>
        </>
    )
}