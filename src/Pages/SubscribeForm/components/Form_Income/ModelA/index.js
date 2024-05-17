// Model A will group all the income sources listed below:
//SelfEmployed,InformalWorker,RentalIncome,FinancialHelpFromOthers,LiberalProfessional,TemporaryRuralEmployee

import { forwardRef } from "react";
import MonthSelection from "../MonthSelection";
import GrossValue from "../GrossValue";
import InformationModelA from "./components/InformationModelA";
import TotalValue from "../TotalValue";
import Pension from "../Pension";

const IncomeFormModelA = forwardRef(({ data }, ref) => {
    return (
        <MonthSelection
            ref={ref}
            data={{ ...data, quantity: 6 }}
            render={[
                GrossValue,
                Pension,
                TotalValue
            ]}
        />
    )
})
export default IncomeFormModelA