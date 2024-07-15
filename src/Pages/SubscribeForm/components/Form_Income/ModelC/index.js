// ModelC refers to the following professions/occupations
//BusinessOwner

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";

import Pension from "../Pension";
import TotalValue from "../TotalValue";
import Dividends from "../Dividends";
import IncomeMonthSelection from "../MonthSelection";
import IncomeFile from "../IncomeFile";

const IncomeFormModelC = forwardRef(({ data, viewMode }, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 6 }}
            render={[
                Dividends,
                Pension,
                IncomeFile,
                TotalValue
            ]}
            viewMode={viewMode}
        />
    )
})


export default IncomeFormModelC