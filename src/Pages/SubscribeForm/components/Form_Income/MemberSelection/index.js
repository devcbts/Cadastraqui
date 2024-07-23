import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import Loader from "Components/Loader";
import FormSelect from "Components/FormSelect";
import candidateService from "services/candidate/candidateService";
import useControlForm from "hooks/useControlForm";
const MemberSelection = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        defaultValues: {
            members: [],
            id: ''
        },
        initialData: data
    }, ref)

    const watchMembers = watch("members")
    const watchId = watch("id")

    const needFetching = data?.members ? data.members.length === 0 : true
    const [isLoading, setIsLoading] = useState(needFetching)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const familyGroup = await candidateService.getFamilyMembers()
                if (familyGroup?.members) {
                    setValue("members", familyGroup.members.map(member => ({ value: member.id, label: member.fullName })))
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        if (needFetching) {
            fetchData()
        }

    }, [])
    return (
        <div className={commonStyles.formcontainer}>
            <Loader loading={isLoading} text="Carregando grupo familiar" />
            <h1 className={commonStyles.title}>Cadastrar renda</h1>
            <FormSelect name={"id"} control={control} label={"integrante"} value={watchId} options={watchMembers} />


        </div>
    )
})

export default MemberSelection