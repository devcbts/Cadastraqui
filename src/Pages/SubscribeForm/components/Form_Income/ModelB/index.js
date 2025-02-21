// ModelB refers to the following professions/occupations
//PrivateEmployee,PublicEmployee,DomesticEmployee,Retired,Pensioner,IncomeTransfer,Apprentice,TemporaryDisabilityBenefit

import { forwardRef } from "react";
import AdvancePayment from "../AdvancePayment";
import Compensation from "../Compensation";
import ExpenseReimbursement from "../ExpenseReimbursement";
import FoodAllowance from "../FoodAllowance";
import GrossValue from "../GrossValue";
import IncomeFile from "../IncomeFile";
import IncomeMonthSelection from "../MonthSelection";
import Pension from "../Pension";
import ReversalValue from "../ReversalValue";
import TransportAllowance from "../TransportAllowance";

const IncomeFormModelB = forwardRef(({ data, viewMode, onAnalysisComplete }, ref) => {

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
            onAnalysisComplete={onAnalysisComplete}
            viewMode={viewMode}
        />
    )
})


export default IncomeFormModelB