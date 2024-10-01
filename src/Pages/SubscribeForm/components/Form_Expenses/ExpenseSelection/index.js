import Card from "Components/Card";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import monthAtom from "Components/MonthSelection/atoms/month-atom";
import { useRecoilValue } from "recoil";
import expenseSelectionSchema from "./schemas/expense-selection-schema";
import styles from './styles.module.scss';

const { default: MonthSelection } = require("Components/MonthSelection");
const { forwardRef, useState, useEffect } = require("react");
const { default: Expenses } = require("../Expenses");
const ExpenseSelection = forwardRef(({ data, viewMode = false }, ref) => {
    const hasSelectedMonth = useRecoilValue(monthAtom)
    const [total, setTotal] = useState('')
    const [avg, setAvg] = useState('')
    useEffect(() => {
        const lastMonthExpenses = parseFloat(data?.months?.sort((a, b) => {
            return new Date(a.date) < new Date(b.date)
        })?.[0]?.totalExpense?.toString().replace(/[^\d,.]/g, '').replace(',', '.') ?? 0)
        const totalExpense = data?.months?.reduce((acc, e) => {
            acc += parseFloat((e.totalExpense ?? 0).toString()?.replace(/[^\d,.]/g, '').replace(',', '.'))
            return acc
        }, 0)
        const validMonths = data?.months?.filter((e) => e.isUpdated)?.length
        const monthAvg = ((totalExpense ?? 0) / (!validMonths ? 1 : validMonths))?.toFixed(2)
        setTotal(moneyInputMask(lastMonthExpenses?.toFixed?.(2)))
        setAvg(moneyInputMask(monthAvg))
    }, [data])
    return (
        <>
            <h1>Despesas Mensais</h1>
            {!hasSelectedMonth && <div className={styles.cards}>
                <Card title={'último mês'}>

                    {total}
                </Card>
                <Card title={'média do trimestre'}>

                    {avg}
                </Card>
            </div>}
            <MonthSelection
                ref={ref}
                data={{ ...data, quantity: 3 }}
                render={[
                    Expenses
                ]}
                viewMode={viewMode}
                schema={expenseSelectionSchema}
            />
        </>
    )
})

export default ExpenseSelection