// ModelC refers to the following professions/occupations
//BusinessOwner

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";

import Pension from "../Pension";
import TotalValue from "../TotalValue";
import Dividends from "../Dividends";
import IncomeMonthSelection from "../MonthSelection";

const IncomeFormModelC = forwardRef(({ data, viewMode }, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 3 }}
            render={[
                Dividends,
                Pension,
                TotalValue
            ]}
            viewMode={viewMode}
        />
    )
})


export default IncomeFormModelC