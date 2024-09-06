import { zodResolver } from "@hookform/resolvers/zod"
import ButtonBase from "Components/ButtonBase"
import FormCheckbox from "Components/FormCheckbox"
import useControlForm from "hooks/useControlForm"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import { z } from "zod"

export default function VehicleList({ onSelect, onAdd, onDelete }) {
    const [isLoading, setIsLoading] = useState(true)
    const [vehicles, setVehicles] = useState({ vehicles: [], hasVehicles: false })
    const { control, setValue } = useForm({
        mode: "onTouched",
        resolver: zodResolver(z.object({ hasVehicles: z.boolean() })),
        defaultValues: { hasVehicles: !vehicles?.hasVehicles },
    })
    const watch = useWatch({ control: control, })
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const vehicle = await candidateService.getVehicle()
                if (vehicle) {
                    setVehicles(vehicle)
                    setValue("hasVehicles", !vehicle.hasVehicles)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const mountRef = useRef(null)
    const handleDelete = async (id) => {
        onDelete(id).then(_ => {
            setVehicles((prev) => ({ ...prev, vehicles: [...prev.vehicles].filter(e => e.id !== id) }))
        })
    }
    useEffect(() => {
        if (!mountRef.current) {
            mountRef.current = true
            return
        }
        const updateProgress = () => {
            try {
                candidateService.updateRegistrationProgress('veiculos', !watch.hasVehicles)
            } catch (err) { }
        }
        if (!vehicles.vehicles.length) {
            updateProgress()
            setVehicles((prev) => ({ ...prev, hasVehicles: !watch.hasVehicles }))
        }

    }, [watch.hasVehicles])
    return (
        <>
            <FormList.Root isLoading={isLoading} title={"Veículos"} >
                <FormList.List
                    list={vehicles.vehicles}
                    render={(item) => (
                        <FormListItem.Root text={item.modelAndBrand}>
                            <FormListItem.Actions>
                                <ButtonBase
                                    label={"Visualizar"}
                                    onClick={() => onSelect(item)}
                                />
                                <ButtonBase
                                    label={"excluir"}
                                    onClick={() => handleDelete(item.id)}
                                    danger
                                />
                            </FormListItem.Actions>
                        </FormListItem.Root>
                    )}
                    text={
                        "Nenhum veículo cadastrado, clique abaixo para realizar o cadastro"
                    }
                >
                    {(!vehicles?.vehicles?.length) && (
                        <FormCheckbox control={control} name={"hasVehicles"} label={"Você ou alguém de seu grupo familiar possui um veículo?"} value={watch.hasVehicles} />
                    )}
                </FormList.List>
            </FormList.Root>
            {(!!vehicles?.vehicles?.length || !vehicles.hasVehicles) &&
                <ButtonBase
                    label={"Novo veículo"}
                    onClick={onAdd}
                />}
        </>
    )
}