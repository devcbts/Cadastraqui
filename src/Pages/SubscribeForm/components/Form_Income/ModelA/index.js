// Model A will group all the income sources listed below:
// SelfEmployed, InformalWorker, RentalIncome, FinancialHelpFromOthers, PrivatePension, LiberalProfessional,TemporaryRuralEmployee

import { forwardRef } from "react";
import GrossValue from "../GrossValue";
import InformationModelA from "./components/InformationModelA";
import TotalValue from "../TotalValue";
import Pension from "../Pension";
import IncomeMonthSelection from "../MonthSelection";
import IncomeFile from "../IncomeFile";

const IncomeFormModelA = forwardRef(({ data, viewMode }, ref) => {
    return (
        <IncomeMonthSelection
            ref={ref}
            data={{ ...data, quantity: 6 }}
            render={[
                GrossValue,
                Pension,
                IncomeFile,
                TotalValue
            ]}
            viewMode={viewMode}
        />
    )
})
export default IncomeFormModelA