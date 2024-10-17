import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";

export default function MemberList({ members, onSelect }) {
    const handleSelection = (id) => {
        const member = members.find(e => e.id === id)
        onSelect(member)
    }
    return (
        <FormList.Root title={'Grupo Familiar'} text={'Membros do grupo familiar do candidato'}>
            <FormList.List list={members} text={'O candidato não cadastrou nenhum membro em seu grupo familiar'} render={(item) => {
                return (
                    <FormListItem.Root text={item.fullName} key={item.id}>
                        <FormListItem.Actions >
                            <ButtonBase label={'visualizar'} onClick={() => handleSelection(item.id)} />
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )
            }}>

            </FormList.List>
        </FormList.Root>
    )
}