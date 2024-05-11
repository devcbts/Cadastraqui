import ButtonBase from 'Components/ButtonBase'
import FormListItem from 'Pages/SubscribeForm/components/FormList/FormListItem'
export default function MemberCard({ name, onView, onRemove }) {

    return (

        <FormListItem.Root text={name}>
            <FormListItem.Actions>
                <ButtonBase label={"visualizar"} onClick={onView} />
                <ButtonBase label={"excluir"} danger onClick={onRemove} />
            </FormListItem.Actions>
        </FormListItem.Root>

    )
}