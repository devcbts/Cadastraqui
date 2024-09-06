import TypeOneCandidatePDF from "./Candidate";
import TypeOneResponsiblePDF from "./Responsible";

export default function TypeOneBenefitsPDF({
    benefit
}) {
    if (!benefit) return null
    if (benefit?.hasResponsible === true) {
        return <TypeOneResponsiblePDF benefit={benefit} />
    }
    if (benefit?.hasResponsible === false) {
        return <TypeOneCandidatePDF benefit={benefit} />
    }
}