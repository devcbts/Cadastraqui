import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from 'Components/ButtonBase'
import CheckboxBase from 'Components/CheckboxBase'
import FormList from 'Pages/SubscribeForm/components/FormList'
import FormListItem from 'Pages/SubscribeForm/components/FormList/FormListItem'
import { useState } from 'react'
import candidateService from 'services/candidate/candidateService'
import DISEASES from 'utils/enums/diseases'
import styles from './styles.module.scss'
import { NotificationService } from 'services/notification'
export default function MemberHealthView({ member, onViewFiles, onSelect, onAdd, edit = true, onBack, onChange = () => { } }) {
    const diseaseList = member?.healthInfo?.map(e => ({ disease: e.disease, data: e })).filter((e) => e.disease !== null)
    const medicationList = member?.healthInfo?.map(e => ({ medication: e.medication?.[0], data: e })).filter((e) => e.medication)
    // TODO: verify if current user/family member has any disease or medication (declare that it has something)
    // and if TRUE, show the button to register a new one
    // if FALSE show only the options to select (yes/no) and update when it changes
    const [hasDiseaseOrMedication, setHasDiseaseOrMedication] = useState(member?.hasDiseaseOrMedication)
    const handleDiseaseOrMedication = async (val) => {
        try {
            setHasDiseaseOrMedication(val)
            if (member.isUser) {
                await candidateService.updateIdentityInfo({ hasSevereDeseaseOrUsesMedication: val })
            } else {
                await candidateService.updateFamilyMember(member.id, { hasSevereDeseaseOrUsesMedication: val })
            }
            NotificationService.success({ text: 'Informações alteradas', type: 'toast' })
            onChange(val)
        } catch (err) { }
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Dados Sobre a Saúde</h1>
                <span className={styles.member}>{member?.name}</span>
            </div>
            <div className={styles.middle}>
                {
                    (diseaseList?.length === 0 && medicationList?.length === 0 && edit) ? <CheckboxBase
                        label={`${member.name} possui alguma doença ou toma medicamento controlado?`}
                        value={hasDiseaseOrMedication}
                        onChange={(e) => handleDiseaseOrMedication(e.target.value === "true")}
                    />
                        :
                        <>
                            <div style={{ width: '100%' }}>
                                <h3>Doença(s) Cadastrada(s)</h3>
                                <FormList.Root>
                                    <FormList.List list={diseaseList} text={"nenhuma doença cadastrada"} render={(item) => (
                                        <FormListItem.Root text={DISEASES.find(e => e.value === item.disease?.diseases[0]).label}>
                                            <FormListItem.Actions>
                                                <ButtonBase label={'laudos'} onClick={() => onViewFiles("health", { id: item.disease.id, originalName: item.disease?.diseases[0], name: DISEASES.find(e => e.value === item.disease?.diseases[0]).label, urls: item.data.urlsHealth })} />
                                                <ButtonBase label={'visualizar'}
                                                    onClick={() => onSelect({ ...item.data, ...item.data.disease, ...item.data.medication?.[0], disease: item.disease?.diseases[0], id: member.id })} />
                                            </FormListItem.Actions>
                                        </FormListItem.Root>
                                    )} />
                                </FormList.Root>
                            </div>
                            <div style={{ width: '100%' }}>
                                <h3>Remédio(s) Controlado(s)</h3>
                                <FormList.Root>
                                    <FormList.List list={medicationList} text={"nenhum medicamento cadastrado"} render={(item) => (
                                        <FormListItem.Root text={item.medication.medicationName}>
                                            <FormListItem.Actions>
                                                <ButtonBase label={'laudos'} onClick={() => onViewFiles("medication", { id: item.medication.id, name: item.medication.medicationName, urls: item.data.urlsmedication })} />
                                                <ButtonBase label={'visualizar'} onClick={() => onSelect({ ...item.data, ...item.data.disease, ...item.medication, disease: item.data.disease?.diseases[0], id: member.id })} />
                                            </FormListItem.Actions>

                                        </FormListItem.Root>
                                    )} />
                                </FormList.Root>
                            </div>
                        </>

                }
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                <ButtonBase onClick={onBack}>
                    <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                </ButtonBase>
                {(edit && hasDiseaseOrMedication) && <ButtonBase label={'cadastrar'} onClick={() => onAdd(member)} />}
            </div>
        </div>
    )
}