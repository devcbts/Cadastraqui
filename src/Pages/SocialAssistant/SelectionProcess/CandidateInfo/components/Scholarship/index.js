import FormRadio from "Components/FormRadio";
import Table from "Components/Table";
import useControlForm from "hooks/useControlForm";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import styles from '../../styles.module.scss';
export default function Scholarship({ data, onChange }) {
    // const handleChange = (v) => {
    //     setChecked(v.target.value)
    //     onChange(
    //         v.target.value === "true"
    //     )
    // }
    const { control, getValues, watch, handleSubmit } = useControlForm({
        defaultValues: {
            partial: null
        },
        initialData: { partial: data?.partial?.toString() }
    })
    const { state } = useLocation()
    const firstMount = useRef(false)
    // const [checked, setChecked] = useState()
    useEffect(() => {
        if (watch('partial') === null) {
            return
        }
        // if (!firstMount.current ) {
        //     firstMount.current = true
        //     return
        // }
        const checked = getValues("partial") === "true"
        const updatePartial = async () => {
            if (!state) { return }
            socialAssistantService.updateApplication(state.applicationId, { partial: checked }).catch(_ => NotificationService.error({ text: 'Falha ao alterar tipo de bolsa' }))
        }
        updatePartial()
    }, [watch("partial")])
    // useEffect(() => {
    //     setChecked(data?.partial?.toString())
    // }, [data])
    return (
        <div className={styles.table}>
            <h3>Renda bruta aferida compatível com:</h3>
            <Table.Root headers={['', 'tipo de bolsa']}>
                <Table.Row>
                    <Table.Cell divider>
                        <FormRadio control={control} name={"partial"} value={"false"} />
                    </Table.Cell>
                    <Table.Cell>
                        Bolsa de estudo INTEGRAL a aluno cuja renda familiar bruta mensal per capita não exceda o valor de 1,5 (um e meio) salário mínimo.
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell divider>
                        <FormRadio control={control} name={"partial"} value={"true"} />

                    </Table.Cell>
                    <Table.Cell>
                        Bolsa de estudo parcial com 50%   (cinquenta por cento) de gratuidade a aluno cuja renda familiar bruta   mensal per capita não exceda o valor de 3 (três) salários mínimos.                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}