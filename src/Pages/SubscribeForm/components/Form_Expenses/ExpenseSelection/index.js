import Card from "Components/Card";
import expenseSelectionSchema from "./schemas/expense-selection-schema";
import styles from './styles.module.scss'
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import stringToFloat from "utils/string-to-float";
import { useRecoilValue } from "recoil";
import monthAtom from "Components/MonthSelection/atoms/month-atom";

const { default: MonthSelection } = require("Components/MonthSelection");
const { forwardRef, useState, useEffect } = require("react");
const { default: Expenses } = require("../Expenses");
const ExpenseSelection = forwardRef(({ data }, ref) => {
    const hasSelectedMonth = useRecoilValue(monthAtom)
    const [total, setTotal] = useState('')
    const [avg, setAvg] = useState('')
    useEffect(() => {
        const totalExpense = data?.months?.reduce((acc, e) => {
            acc += stringToFloat(e.totalExpense.toString())
            return acc
        }, 0)
        const validMonths = data?.months?.filter((e) => e.isUpdated)?.length
        console.log(validMonths)
        const monthAvg = ((totalExpense ?? 0) / (!validMonths ? 1 : validMonths))?.toFixed(2)
        console.log(monthAvg)
        setTotal(moneyInputMask(totalExpense?.toFixed(2)))
        setAvg(moneyInputMask(monthAvg))
    }, [data])
    return (
        <>
            <h1>Despesas Mensais</h1>
            {!hasSelectedMonth && <div className={styles.cards}>
                <Card.Root>
                    <Card.Title text={'total das despesas'}></Card.Title>
                    <Card.Content>
                        {total}
                    </Card.Content>
                </Card.Root>
                <Card.Root>
                    <Card.Title text={'média das despesas'}></Card.Title>
                    <Card.Content>
                        {avg}
                    </Card.Content>
                </Card.Root>
            </div>}
            <MonthSelection
                ref={ref}
                data={{ ...data, quantity: 3 }}
                render={[
                    Expenses
                ]}
                schema={expenseSelectionSchema}
            />
        </>
    )
})

export default ExpenseSelection