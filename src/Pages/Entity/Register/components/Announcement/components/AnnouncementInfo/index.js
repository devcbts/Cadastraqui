import ButtonBase from "Components/ButtonBase";
import FormCheckbox from "Components/FormCheckbox";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import { useRef } from "react";
import ANNOUNCEMENT_TYPE from "utils/enums/announcement-types";
import EDUCATION_TYPE from "utils/enums/education-type";
import Interview from "./Interview";
import announcementInfoSchema from "./schemas/announcement-info-schema";
// announcementDate - final announcement date
// announcementBegin - announcement start date
// openDate - subscription start
// closeDate - subscription end
export default function AnnouncementInfo({ data, onPageChange }) {
    const interviewRef = useRef(null)
    const { control, watch, getValues, formState: { isValid }, trigger, setValue } = useControlForm({
        schema: announcementInfoSchema,
        defaultValues: {
            announcementType: "",
            educationLevel: "",
            openDate: "",
            closeDate: "",
            announcementDate: "",
            announcementBegin: "",
            announcementName: "",
            waitingList: null,
            hasInterview: null,
            announcementInterview: null
        },
        initialData: data
    })
    const handleInterview = (data) => {
        setValue('announcementInterview', data)
    }
    const handleSubmit = () => {
        if (interviewRef.current && !interviewRef?.current?.validate()) {
            return
        }
        if (!isValid) {
            trigger()
            return
        }
        const data = getValues()
        onPageChange(1, data)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h1>Informações Cadastrais</h1>
            <div style={{ width: 'max(290px, 50%)' }}>
                <FormSelect control={control} name={"announcementType"} label={'tipo do edital'} options={ANNOUNCEMENT_TYPE} value={watch("announcementType")} />
                <FormSelect control={control} name={"educationLevel"} label={'nível de ensino'} options={EDUCATION_TYPE} value={watch("educationLevel")} />
                <InputForm control={control} name={"announcementName"} label={'nome do edital'} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                    <InputForm control={control} name={"announcementBegin"} label={'data de abertura do edital'} type="date" />
                    <InputForm control={control} name={"announcementDate"} label={'data vigência do edital'} type="date" />
                    <InputForm control={control} name={"openDate"} label={'data de início das inscrições'} type="date" />
                    <InputForm control={control} name={"closeDate"} label={'data limite das inscrições'} type="date" />
                </div>
                <FormCheckbox control={control} label={'haverá lista de espera?'} name={"waitingList"} />
                <FormCheckbox control={control} label={'haverá entrevista obrigatória com o candidato?'} name={"hasInterview"} />
                {
                    watch("hasInterview") && (
                        <Interview data={getValues("annoucementInterview")} onChange={handleInterview} ref={interviewRef} />
                    )
                }
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}