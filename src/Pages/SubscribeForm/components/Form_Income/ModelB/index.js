// ModelB refers to the following professions/occupations
//PrivateEmployee,PublicEmployee,DomesticEmployee,Retired,Pensioner,IncomeTransfer,Apprentice,TemporaryDisabilityBenefit

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
import IncomeMonthSelection from "../MonthSelection";
import IncomeFile from "../IncomeFile";

const IncomeFormModelB = forwardRef(({ data, viewMode }, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 6 }}
            render={[
                GrossValue,
                FoodAllowance,
                TransportAllowance,
                ExpenseReimbursement,
                AdvancePayment,
                ReversalValue,
                Compensation,
                Pension,
                IncomeFile,
            ]}
            viewMode={viewMode}
        />
    )
})


export default IncomeFormModelB