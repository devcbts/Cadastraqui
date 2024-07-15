import FinancialHelpPdf from "./FinancialHelpPdf";

const { default: ButtonBase } = require("Components/ButtonBase");
const { default: PropertyOwner } = require("Pages/SubscribeForm/components/Form_Habitation/components/PropertyOwner");
const { forwardRef, useState } = require("react");
const { default: IncomeFile } = require("../../../IncomeFile");

const FinancialHelp = forwardRef(({ data }, ref) => {
    const [pdf, setPdf] = useState(false)
    return (
        <>
            <IncomeFile ref={ref} data={data} label={'Declaração assinada'} required />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ButtonBase label={'Gerar declaração'} onClick={() => setPdf(true)} />
                <PropertyOwner show={pdf} onClose={() => setPdf(false)} pdf={(pdfdata) =>
                    <FinancialHelpPdf
                        owner={pdfdata}
                        lastIncomeHelp={data?.months?.[0]?.grossAmount}
                        memberId={data?.member?.id}
                    />} />
            </div>
        </>
    )
})

export default FinancialHelp