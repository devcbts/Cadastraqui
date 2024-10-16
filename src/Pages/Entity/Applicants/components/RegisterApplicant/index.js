
import { useLocation } from "react-router";
import ApplicantInformation from "./components/ApplicantInformation";
import BackPageTitle from "Components/BackPageTitle";
import ApplicantsDocuments from "./components/ApplicantsDocuments";
export default function EntityApplicantsRegisterApplicant() {
    const { state } = useLocation()
    return (
        <>
            <BackPageTitle path={-1} title={'Realizar matrícula'} />

            {!state?.documents
                ? <ApplicantInformation />
                : <ApplicantsDocuments />
            }
        </>
    )
}