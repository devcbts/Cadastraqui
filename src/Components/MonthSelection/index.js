import { forwardRef, useEffect, useImperativeHandle } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { useRecoilState } from "recoil";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import styles from './styles.module.scss'
import useControlForm from "hooks/useControlForm";
import monthAtom from "./atoms/month-atom";
// quantity = months that user needs to fullfill in order to proceed saving information
const MonthSelection = forwardRef(({ data, render = [], schema, viewMode = false }, ref) => {
    const { watch, setValue, getValues, trigger, formState: { errors } } = useControlForm({
        schema: schema,
        defaultValues: {
            months: [],
            quantity: data.quantity
        },
        initialData: data
    }, ref)

    const getMonths = () => {
        return Array.from({ length: data.quantity }).map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(1)
            currentDate.setMonth(currentDate.getMonth() - (index + 1));
            return {
                getDate: currentDate,
                getDateString: currentDate.toLocaleString("pt-br", { month: "long", year: "numeric" })
            }
        })
    }
    useEffect(() => {
        // Get the current value (if API returns any) and prepend on the array
        const incomes = getValues("months") ?? []
        const quantity = data?.quantity
        const appendOn = quantity - incomes.length
        const newArray = Array.from({ length: quantity }).map((e, i) => {
            // Compare function to validate if specific month was already on the response, if it's true => set isUpdated to true (just to display error)
            const hasMonthInfo = (date) => {
                return !!incomes.find(e => ((new Date(e.date).getMonth() === new Date(date).getMonth()) && (new Date(e.date).getFullYear() === new Date(date).getFullYear())))
            }
            if (i >= appendOn) {
                const currObj = incomes[i - appendOn]
                return { ...currObj, isUpdated: hasMonthInfo(currObj.date), dateString: new Date(currObj.date).toLocaleString("pt-br", { month: "long", year: "numeric" }) }
            }
            const { getDate, getDateString } = getMonths()[i]
            return { ...e, date: getDate, isUpdated: hasMonthInfo(getDate), dateString: getDateString }
        })
        // set the current incomes value to the newArray created, do it only ONCE when this component is rendered
        setValue("months",
            newArray.sort((a, b) => {
                const dateA = new Date(a.date), dateB = new Date(b.date)
                return dateA < dateB
            })
        )
        return () => {
            setMonthSelected(null)
        }
    }, [ref])
    const watchMonths = watch("months")

    const [monthSelected, setMonthSelected] = useRecoilState(monthAtom)

    const handleSave = (_, data) => {
        // Find the current month to be updated at "months" array, then update the entire array
        const monthsToUpdate = watchMonths.map(e => {
            if (e.date === monthSelected.date) {
                return { ...monthSelected, ...data, isUpdated: true }
            }
            return e
        })
        setValue("months", monthsToUpdate)
        trigger()
        setMonthSelected(null)

    }
    const { Steps,
        state: { activeStep, setData, setActiveStep },
        pages: { previous, next },
        max,
    } = useStepFormHook({
        render,
        onSave: handleSave,
        showStepper: false,
        viewMode: viewMode
    })
    const handleSelectMonth = (month) => {
        setActiveStep(1)
        setMonthSelected(month)
        setData(month)
    }

    const handlePrevious = () => {
        if (activeStep === 1) {
            setMonthSelected(null)
        } else {
            previous()
        }
    }
    // Render the current selected month data based on what month user has clicked
    // If NO month is selected, then the field to be send to API ("months") will stay the same as it is
    // Else, the other pages will be responsible for changing the data, and THIS component will save the new data to the specified "months" array 
    // setMonth is responsible for keep tracking of which month is selected, it's using recoil so the component isn't remounted each data change,
    // not triggering useEffect many times (it'd result on every month having 'isUpdated:true')
    return (
        <>
            {!monthSelected &&
                <>
                    <p className={styles.text}>Agora realize o cadastro para cada um dos meses abaixo, inserindo as informações correspondentes.</p>
                    {
                        Array.from({ length: data.quantity }).map((_, index) => (
                            <div className={styles.wrapper}>
                                <ButtonBase label={watchMonths?.[index]?.dateString} onClick={() => handleSelectMonth(watchMonths?.[index])} />
                                {errors?.months?.[index]?.isUpdated?.message && <p className={styles.error}>{watchMonths?.[index]?.dateString} desatualizado</p>}
                            </div>

                        ))
                    }
                </>
            }
            {
                monthSelected && (
                    <>
                        <span className={styles.month}>{monthSelected.dateString}</span>
                        <fieldset disabled={viewMode}>
                            <Steps />
                        </fieldset>
                        {<div className={commonStyles.actions}>
                            <ButtonBase onClick={handlePrevious}>
                                <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                            </ButtonBase>
                            {activeStep !== max &&
                                <ButtonBase onClick={next}>
                                    <Arrow width="40px" />
                                </ButtonBase>
                            }
                            {
                                (activeStep === max && !viewMode) && (
                                    <ButtonBase onClick={next}>
                                        Salvar
                                    </ButtonBase>
                                )
                            }

                        </div>}
                    </>
                )
            }
        </>
    )
})

export default MonthSelection