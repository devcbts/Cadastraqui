import Loader from "Components/Loader"
import { createContext, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import socialAssistantService from "services/socialAssistant/socialAssistantService"

export const selectionProcessContext = createContext(null)

export default function SelectionProcessContext({ children }) {
    const { state, pathname } = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [summary, setSummary] = useState({
        candidateInfo: {},
        familyMembersInfo: [],
        housingInfo: {},
        vehicles: [],
        familyMembersDiseases: [],
        importantInfo: {},
        documentsUrls: [],
        applicationInfo: {},
        majoracao: {},
        interviewDocument: {},
        visitDocument: {},
        solicitations: [],
    })
    const loaded = useRef(false)
    useEffect(() => {
        // if (!state?.applicationId) {
        //     navigate(-1)
        // }

        // TODO: load all user information to display on screen
        const fetchCandidateInfo = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getCandidateResume(state?.applicationId)
                if (information.applicationInfo.status === 'NotAnalysed') {
                    socialAssistantService.updateApplication(state?.applicationId, { status: 'Pending' })
                }
                setSummary(information)
            } catch (err) { }
            setIsLoading(false)
        }
        if (pathname.split('/').at(-1) === 'resumo' && !loaded.current) {
            loaded.current = true
            fetchCandidateInfo()
        } else {

            setIsLoading(false)
        }


    }, [state])

    return (
        <selectionProcessContext.Provider value={{ data, setData, summary, setSummary }}>
            <Loader loading={isLoading} text="Carregando informações do candidato" />
            {children}
        </selectionProcessContext.Provider>
    )
}