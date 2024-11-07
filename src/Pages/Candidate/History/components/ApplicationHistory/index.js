import BackPageTitle from "Components/BackPageTitle";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import HistoryCard from "../HistoryCard";
import Loader from "Components/Loader";
import { motion } from 'framer-motion'
export default function ApplicationHistory() {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { applicationId } = useParams()
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getHistory(applicationId)
                setHistory(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        if (applicationId) fetchHistory()
    }, [])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Histórico da inscrição'} path={-1} />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', placeSelf: 'center', minWidth: 'min(100%, 800px)', gap: '24px' }}>

                {
                    history.map((e, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1.2, 1], opacity: 1 }}
                            transition={{ delay: index * .3, repeatType: 'reverse', duration: .7 }}
                            style={{ display: 'flex', placeContent: e.createdBy === "Candidate" ? "end" : "start", width: '100%' }}
                        >
                            <HistoryCard history={e} />
                        </motion.div>
                    ))
                }
            </div>
        </>
    )
}