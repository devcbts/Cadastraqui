import Table from 'Components/Table'
import styles from './styles.module.scss'
import useControlForm from 'hooks/useControlForm'
import expenseSchema from './schemas/expense-schema'
import expenseDescriptionAndField from '../utils/expenseDescriptionAndField'
import ExpenseMoneyInput from './components/ExpenseMoneyInput'
import Card from 'Components/Card'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import ButtonBase from 'Components/ButtonBase'
import InputForm from 'Components/InputForm'
import ExpenseInput from './components/ExpenseInput'
import moneyInputMask from 'Components/MoneyFormInput/money-input-mask'
import getTotalExpense from '../utils/getTotalExpense'
const { forwardRef, useEffect } = require("react")
const Expenses = forwardRef(({ data }, ref) => {
    const { control, getValues, setValue, watch: watchValue } = useControlForm({
        schema: expenseSchema,
        defaultValues: {
            waterSewage: '',
            electricity: '',
            landlinePhone: '',
            food: '',
            rent: '',
            condominium: '',
            cableTV: '',
            streamingServices: '',
            fuel: '',
            annualIPVA: '',
            annualIPTU: '',
            financing: '',
            annualIR: '',
            schoolTransport: '',
            creditCard: '',
            internet: '',
            courses: '',
            healthPlan: '',
            medicationExpenses: '',
            additionalExpenses: [],
            totalExpense: ''
        },
        initialData: data
    }, ref)
    const watchExceptTotal = () => {
        const { totalExpense, ...rest } = getValues()
        // avoid infinite loop on rendering
        const fields = Object.keys(rest).reduce((acc, e) => {
            acc[`${e}`] = getValues(`${e}`)
            return acc
        }, {})
        return fields
    }
    const watch = useWatch({ control: control, name: Object.keys(watchExceptTotal()) })
    useEffect(() => {
        if (data) {
            setValue('additionalExpenses', data?.additionalExpenses ?? [])
        }
    }, [])
    const { fields, append, remove } = useFieldArray({
        name: "additionalExpenses",
        control: control,
    })
    const handleNewExpense = () => {
        append({
            description: '',
            value: ''
        })
    }
    const handleRemoveAdditionalExpense = (index) => {
        remove(index)
    }
    useEffect(() => {
        // calculate the sum of all elements whenever any field is changed

        setValue('totalExpense', getTotalExpense(watchExceptTotal()))
    }, [watch])
    return (
        <div className={styles.container}>
            <Card.Root >
                <Card.Title text={'soma das despesas do mês'} />
                <Card.Content>
                    {watchValue('totalExpense')}
                </Card.Content>
            </Card.Root>
            <Table.Root headers={['descrição', 'valor']}>
                {expenseDescriptionAndField.map((e) => {
                    return (
                        <Table.Row key={e.field}>
                            <Table.Cell>
                                {e.description}
                            </Table.Cell>
                            <Table.Cell>
                                <ExpenseMoneyInput control={control} name={e.field} />
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
                <Table.Row>
                    <Table.Cell>Deseja lançar outra despesa ou empréstimos?</Table.Cell>
                    <Table.Cell><ButtonBase label={'nova despesa'} onClick={handleNewExpense} /></Table.Cell>
                </Table.Row>
                {fields.map((field, i) => (
                    <Table.Row key={field.id}>
                        <Table.Cell><ExpenseInput control={control} name={`additionalExpenses.${i}.description`} /></Table.Cell>
                        <Table.Cell>
                            <>
                                <ExpenseMoneyInput control={control} name={`additionalExpenses.${i}.value`} />
                                <span style={{ cursor: 'pointer' }} onClick={() => handleRemoveAdditionalExpense(i)}>X</span>
                            </>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Root>

        </div>
    )
})

export default Expenses