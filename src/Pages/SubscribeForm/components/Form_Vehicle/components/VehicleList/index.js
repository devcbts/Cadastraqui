import ButtonBase from "Components/ButtonBase"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"

export default function VehicleList({ onSelect, onAdd }) {
    const [isLoading, setIsLoading] = useState(true)
    const [vehicles, setVehicles] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const vehicle = await candidateService.getVehicle()
                if (vehicle) {
                    setVehicles(vehicle)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
            <FormList.Root isLoading={isLoading} title={"Veículos"} >
                <FormList.List
                    list={vehicles}
                    render={(item) => (
                        <FormListItem.Root text={item.modelAndBrand}>
                            <FormListItem.Actions>
                                <ButtonBase
                                    label={"Visualizar"}
                                    onClick={() => onSelect(item)}
                                />
                            </FormListItem.Actions>
                        </FormListItem.Root>
                    )}
                    text="Nenhum veículo cadastrado, clique abaixo para realizar o cadastro"
                />
            </FormList.Root>
            <ButtonBase
                label={"Novo veículo"}
                onClick={onAdd}
            />
        </>
    )
}