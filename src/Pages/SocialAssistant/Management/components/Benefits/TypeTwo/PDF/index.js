import TypeTwoCandidatePDF from "./Candidate";
import TypeTwoResponsiblePDF from "./Responsible";

export default function TypeTwoBenefitsPDF({
    benefit
}) {
    if (!benefit) return null
    if (benefit?.hasResponsible === true) {
        return <TypeTwoResponsiblePDF benefit={benefit} />
    }
    if (benefit?.hasResponsible === false) {
        return <TypeTwoCandidatePDF benefit={benefit} />
    }
}