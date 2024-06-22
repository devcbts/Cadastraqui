import Table from "Components/Table";
import styles from '../../styles.module.scss'
import { useMemo, useState } from "react";
export default function Scholarship({ data, onChange }) {
    const handleChange = (v) => {
        setChecked(v.target.value)
        onChange(
            v.target.value === "true"
        )
    }
    const [checked, setChecked] = useState(data?.partial?.toString())
    console.log(data)
    return (
        <div className={styles.table}>
            <h3>Renda bruta aferida compatível com:</h3>
            <Table.Root headers={['', 'tipo de bolsa']}>
                <Table.Row>
                    <Table.Cell divider>
                        <input type="radio" name="partial" checked={checked === "false"} value={"false"} onChange={handleChange}></input>
                    </Table.Cell>
                    <Table.Cell>
                        Bolsa de estudo INTEGRAL a aluno cuja renda familiar bruta mensal per capita não exceda o valor de 1,5 (um e meio) salário mínimo.
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell divider>
                        <input type="radio" name="partial" checked={checked === "true"} value={"true"} onChange={handleChange}></input>

                    </Table.Cell>
                    <Table.Cell>
                        Bolsa de estudo parcial com 50%   (cinquenta por cento) de gratuidade a aluno cuja renda familiar bruta   mensal per capita não exceda o valor de 3 (três) salários mínimos.                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}