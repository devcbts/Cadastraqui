import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";

export default function VehicleList({ vehicles, onSelect }) {
    return (
        <FormList.Root title={'Veículos'}>
            <FormList.List list={vehicles} text={'O candidato não cadastrou nenhum veículo'} render={(item) => {
                return (<FormListItem.Root>
                    <FormListItem.Actions>
                        <ButtonBase label={'visualizar'} onClick={() => onSelect(item.id)} />
                    </FormListItem.Actions>
                </FormListItem.Root>)
            }}>
            </FormList.List>
        </FormList.Root>
    )
}