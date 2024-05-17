import UnemployementInsurance from "./components/UnemployementInsurance";

const { default: MonthSelection } = require("../MonthSelection");
const { default: GrossValue } = require("../GrossValue");
const { default: Pension } = require("../Pension");
const { default: TotalValue } = require("../TotalValue");
const { forwardRef } = require("react");

const UnemployedModel = forwardRef(({ data }, ref) => {
    return <MonthSelection
        ref={ref}
        data={data}
        render={[
            UnemployementInsurance
        ]}
    />
})

export default UnemployedModel