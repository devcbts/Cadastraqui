import UnemployementInsurance from "./components/UnemployementInsurance";

const { default: IncomeMonthSelection } = require("../MonthSelection");

const { forwardRef } = require("react");

const UnemployedModel = forwardRef(({ data }, ref) => {
    return <IncomeMonthSelection
        ref={ref}
        data={data}
        render={[
            UnemployementInsurance
        ]}
    />
})

export default UnemployedModel