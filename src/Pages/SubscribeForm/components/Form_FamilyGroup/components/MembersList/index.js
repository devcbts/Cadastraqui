import ButtonBase from "Components/ButtonBase";
import MemberCard from "./components/MemberCard";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import Loader from "Components/Loader";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import FormList from "Pages/SubscribeForm/components/FormList";
export default function MembersList({ onSelect, onAdd }) {
    const [familyMembers, setFamilyMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const members = await candidateService.getFamilyMembers()
                if (members) {
                    setFamilyMembers(members)
                }
            } catch (err) {

                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const handleDeleteMember = async (id) => {
        setIsLoading(true)
        try {
            await candidateService.deleteFamilyMember(id)
            setFamilyMembers((prevState) => prevState.filter(member => member.id !== id))
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)
    }

    const handleConfirmDelete = async (id) => {
        await NotificationService.confirm({
            title: "Tem certeza?",
            text: "Esta ação não poderá ser desfeita",
            onConfirm: async () => await handleDeleteMember(id),
        })
    }
    const handleSelectMember = (id) => {
        const member = familyMembers.find(m => m.id === id)
        onSelect(member)
    }
    return (
        <>
            <FormList.Root isLoading={isLoading} text={'Selecione um parente ou cadastre um novo'} title={'Integrantes do Grupo Familiar'}>
                <FormList.List list={familyMembers} text='Você ainda não registrou nenhum membro para o grupo familiar, clique no botão abaixo para realizar o primeiro cadastro' render={(item) => (
                    <MemberCard name={item.fullName} onView={() => handleSelectMember(item.id)} onRemove={() => handleConfirmDelete(item.id)} />
                )} />
            </FormList.Root>
            <ButtonBase
                label="adicionar"
                onClick={onAdd}
            />

        </>
    )
}