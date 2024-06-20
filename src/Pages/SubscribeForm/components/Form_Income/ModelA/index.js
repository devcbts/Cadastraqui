// Model A will group all the income sources listed below:
// SelfEmployed, InformalWorker, RentalIncome, FinancialHelpFromOthers, PrivatePension, LiberalProfessional,TemporaryRuralEmployee

import { forwardRef } from "react";
import GrossValue from "../GrossValue";
import InformationModelA from "./components/InformationModelA";
import TotalValue from "../TotalValue";
import Pension from "../Pension";
import IncomeMonthSelection from "../MonthSelection";

const IncomeFormModelA = forwardRef(({ data, viewMode}, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 6 }}
            render={[
                GrossValue,
                Pension,
                TotalValue
            ]}
            viewMode={viewMode}
        />
    )
})
export default IncomeFormModelA