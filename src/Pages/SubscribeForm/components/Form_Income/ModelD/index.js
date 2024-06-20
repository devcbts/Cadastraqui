// ModelD refers to the following professions/occupations
//Alimony,FinancialHelpFromOthers

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";

import TotalValue from "../TotalValue";
import GrossValue from "../GrossValue";
import IncomeMonthSelection from "../MonthSelection";

const IncomeFormModelD = forwardRef(({ data, viewMode }, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 3 }}
            render={[
                GrossValue,
                TotalValue
            ]}
            viewMode={viewMode}
        />
    )
})


export default IncomeFormModelD