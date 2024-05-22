// ModelD refers to the following professions/occupations
//Alimony,FinancialHelpFromOthers

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";

import TotalValue from "../TotalValue";
import GrossValue from "../GrossValue";

const IncomeFormModelD = forwardRef(({ data }, ref) => {
    return (
        <MonthSelection
            ref={ref}
            data={{ ...data, quantity: 3 }}
            render={[
                GrossValue,
                TotalValue
            ]}
        />
    )
})


export default IncomeFormModelD