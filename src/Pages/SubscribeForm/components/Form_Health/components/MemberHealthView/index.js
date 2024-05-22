import ButtonBase from 'Components/ButtonBase'
import styles from './styles.module.scss'
import FormList from 'Pages/SubscribeForm/components/FormList'
import FormListItem from 'Pages/SubscribeForm/components/FormList/FormListItem'
import DISEASES from 'utils/enums/diseases'
export default function MemberHealthView({ member, onSelect, onAdd }) {
    const diseaseList = member?.healthInfo?.map(e => ({ disease: e.disease, data: e }))

    console.log(member)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Dados Sobre a Saúde</h1>
                <span className={styles.member}>{member?.name}</span>
            </div>
            <div className={styles.middle}>
                <div style={{ width: '100%' }}>
                    <h3>Doença(s) Cadastrada(s)</h3>
                    <FormList.Root>
                        <FormList.List list={diseaseList} text={"nenhuma doença cadastrada"} render={(item) => (
                            <FormListItem.Root text={DISEASES.find(e => e.value === item.disease.diseases[0]).label}>
                                <FormListItem.Actions>
                                    <ButtonBase label={'editar'} onClick={() => onSelect({ ...item.data.disease, disease: item.disease.diseases[0], id: member.id })} />
                                </FormListItem.Actions>
                            </FormListItem.Root>
                        )} />
                    </FormList.Root>
                </div>
                <div style={{ width: '100%' }}>
                    <h3>Remédio(s) Controlado(s)</h3>
                    <FormList.Root>
                        <FormList.List list={[]} text={"nenhum medicamento cadastrado"} render={(item) => (
                            <FormListItem.Root text={DISEASES.find(e => e.value === item.diseases[0]).label}>

                            </FormListItem.Root>
                        )} />
                    </FormList.Root>
                </div>
            </div>
            <ButtonBase label={'cadastrar'} onClick={() => onAdd(member)} />
        </div>
    )
}