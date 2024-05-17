// ModelB refers to the following professions/occupations
//PrivateEmployee,PublicEmployee,DomesticEmployee,Retired,Pensioner,Apprentice,TemporaryDisabilityBenefit

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";
import FoodAllowance from "../FoodAllowance";
import TransportAllowance from "../TransportAllowance";
import ExpenseReimbursement from "../ExpenseReimbursement";
import AdvancePayment from "../AdvancePayment";
import GrossValue from "../GrossValue";
import ReversalValue from "../ReversalValue";
import Compensation from "../Compensation";
import Pension from "../Pension";

const IncomeFormModelB = forwardRef(({ data }, ref) => {
    return (
        <MonthSelection
            ref={ref}
            data={{ ...data, quantity: 3 }}
            render={[
                GrossValue,
                FoodAllowance,
                TransportAllowance,
                ExpenseReimbursement,
                AdvancePayment,
                ReversalValue,
                Compensation,
                Pension
            ]}
        />
    )
})


export default IncomeFormModelB