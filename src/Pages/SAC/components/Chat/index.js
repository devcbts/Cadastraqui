import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Loader from "Components/Loader";
import useAuth from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";

export default function ChatSAC() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [call, setCall] = useState()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const { auth } = useAuth()
    const listRef = useRef()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await callService.getCallById(id)
                setCall(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message }).then(_ => navigate(-1))
            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    // trick to always scroll to bottom
    useEffect(() => {

        listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    }, [call?.Messages])
    const handleSendMessage = async () => {
        try {
            if (!message) {
                return
            }
            const newMessage = await callService.sendMessage({ id, message })
            setCall((prev) => ({ ...prev, Messages: [...prev.Messages, newMessage] }))
            setMessage('')
        } catch (err) {

        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={`Chamado x${call?.number.toString().padStart(5, '0') ?? ''}`} path={-1} />
            <div style={{ margin: '32px', height: '80%' }}>
                <div style={{ padding: '16px', border: '2px solid #CFCFCF', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {
                        <div style={{ height: '100%', padding: '12px 0', overflow: 'auto' }} ref={listRef}>
                            {call?.Messages?.map(message => {

                                return (
                                    <div
                                        key={message.id}
                                        style={{
                                            marginLeft: auth?.sub === message.user_id ? '10%' : '0',
                                            backgroundColor: auth?.sub === message.user_id ? '#1F4B73' : 'white',
                                            color: auth?.sub !== message.user_id ? '#1F4B73' : 'white',
                                            marginRight: auth?.sub !== message.user_id ? '10%' : '0',
                                            border: '1px solid #C2C2C2',
                                            borderRadius: '8px',
                                            maxHeight: 'fit-content',
                                            padding: '4px 4px 8px 8px',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}>
                                        {message.message}
                                        {message.url && (
                                            <Link to={message.url} target="_blank" style={{
                                                color: auth?.sub !== message.user_id ? '#1F4B73' : 'white',
                                            }}>Ver anexo</Link>
                                        )}
                                    </div>
                                )
                            })}

                        </div>
                    }
                    {
                        call?.status !== "CLOSED" && <div style={{ display: 'flex', flexDirection: 'row', maxHeight: '100px', alignItems: 'baseline', gap: '16px' }}>
                            <InputBase error={null} name={"message"} placeholder="Digite uma mensagem..." onChange={(e) => setMessage(e.target.value)} value={message} />
                            <ButtonBase label={'enviar'} onClick={handleSendMessage} disabled={!message} />
                        </div>}
                </div>

            </div >
        </>
    )
}