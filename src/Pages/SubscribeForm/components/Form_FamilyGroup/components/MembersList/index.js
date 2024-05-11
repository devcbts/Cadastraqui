import ButtonBase from "Components/ButtonBase";
import MemberCard from "./components/MemberCard";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import Loader from "Components/Loader";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
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
                NotificationService.error({ text: err.response.data.message })
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
    const handleSelectMember = (id) => {
        const member = familyMembers.find(m => m.id === id)
        onSelect(member)
    }
    return (
        <>
            <Loader loading={isLoading} />
            <div>
                <h1 className={commonStyles.title}>Parentes Cadastrados</h1>
                <p>Selecione um parente ou cadastre um novo</p>
            </div>
            {familyMembers.length > 0 && (
                <div className={styles.list}>
                    {familyMembers.map(member => (
                        <MemberCard name={member.fullName} onView={() => handleSelectMember(member.id)} onRemove={() => handleDeleteMember(member.id)} />
                    ))}
                </div>
            )}
            {familyMembers.length === 0 && (
                <p className={styles.emptytext}> Você ainda não registrou nenhum membro para o grupo familiar, clique no botão abaixo para realizar o primeiro cadastro</p>
            )}
            <ButtonBase
                label="novo parentesco"
                onClick={onAdd}
            />

        </>
    )
}