import InterestCards from "Components/Announcement/InterestCards";
import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import SelectBase from "Components/SelectBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function InterestListing({
    loadAnnouncements,
    nameKey
}) {
    const [params, setParams] = useSearchParams()
    const announcementId = params.get('view')
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(announcementId)
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true)
            try {
                const information = await loadAnnouncements()
                const mapAnnoucements = information.announcements.map(e => ({ value: e.id, label: e.name ?? e[nameKey] }))
                setAnnouncements(mapAnnoucements)
                if (announcementId) {
                    setSelectedAnnouncement(mapAnnoucements.find(e => e.value === announcementId))
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchAnnouncements()
    }, [])

    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle path={'/home'} title={'Lista de interessados'} />
            <div style={{ maxWidth: 'max(25%,300px)', marginBottom: '24px' }}>

                <SelectBase
                    error={null}
                    options={announcements}
                    value={selectedAnnouncement}
                    label="Selecione um edital"
                    onChange={(e) => {
                        setSelectedAnnouncement(e)
                        setParams({ view: e.value })

                    }}
                />
            </div>
            <InterestCards
                canNavigate={false}
                announcementId={selectedAnnouncement?.value}
            >
                {({ candidateInterest }) => {
                    return (<Table.Root headers={['nome completo', 'cadastro', 'preenchimento', 'email', 'telefone']}>

                        {
                            candidateInterest?.map(e => (
                                <Table.Row>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.status}</Table.Cell>
                                    <Table.Cell>{e.percentage}%</Table.Cell>
                                    <Table.Cell>{e.email}</Table.Cell>
                                    <Table.Cell>{e.phone}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>)
                }}

            </InterestCards>
        </>
    )
}