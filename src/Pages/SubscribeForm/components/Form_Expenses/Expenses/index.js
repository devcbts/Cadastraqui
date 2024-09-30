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
const { forwardRef, useEffect, useState } = require("react")
const Expenses = forwardRef(({ data }, ref) => {
    const [checkeds, setCheckeds] = useState([])

    const { control, getValues, setValue, watch: watchValue, resetField } = useControlForm({
        schema: expenseSchema(checkeds),
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
            justifywaterSewage: '',
            justifyelectricity: '',
            justifylandlinePhone: '',
            justifyfood: '',
            justifyrent: '',
            justifycondominium: '',
            justifycableTV: '',
            justifystreamingServices: '',
            justifyfuel: '',
            justifyannualIPVA: '',
            justifyannualIPTU: '',
            justifyfinancing: '',
            justifyannualIR: '',
            justifyschoolTransport: '',
            justifycreditCard: '',
            justifyinternet: '',
            justifycourses: '',
            justifyhealthPlan: '',
            justifymedicationExpenses: '',
            additionalExpenses: [],
            totalExpense: ''
        },
        initialData: data
    }, ref)
    const watchExceptTotal = () => {
        const { totalExpense, ...rest } = getValues()
        // avoid infinite loop on rendering
        const fields = Object.keys(rest).reduce((acc, e) => {
            if (e.startsWith('justify')) { return acc }
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
    const handleCheckExpense = (field) => {
        // if value is already on list
        if (checkeds.includes(field)) {
            resetField(`justify${field}`, { defaultValue: '' })
            setCheckeds(prev => [...prev].filter(e => e !== field))
        } else {
            setValue(field, '0')
            setCheckeds(prev => [...prev, field])
        }

    }
    useEffect(() => {
        expenseDescriptionAndField.forEach(e => {
            if (data?.[`justify${e.field}`]) {
                setCheckeds(prev => [...prev, e.field])
            }
        })
    }, [data])
    return (
        <div className={styles.container}>
            <Card title={'soma das despesas do mês'}>

                {watchValue('totalExpense')}
            </Card>
            <Table headers={['descrição', 'valor', 'não se aplica', 'justificativa']}>
                {expenseDescriptionAndField.map((e) => {
                    return (
                        <Table.Row key={e.field}>
                            <Table.Cell>
                                {e.description}
                            </Table.Cell>
                            <Table.Cell>
                                <ExpenseMoneyInput control={control} name={e.field} disabled={checkeds?.includes(e.field)} />
                            </Table.Cell>
                            <Table.Cell>
                                <input type='checkbox' defaultChecked={data?.[`justify${e.field}`]} onChange={(_) => handleCheckExpense(e.field)} />
                            </Table.Cell>
                            {checkeds?.includes(e.field) && <Table.Cell>
                                <InputForm control={control} name={`justify${e.field}`} disabled={!checkeds?.includes(e.field)} />
                            </Table.Cell>}
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
            </Table>

        </div>
    )
})

export default Expenses