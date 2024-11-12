import InterestCards from "Components/Announcement/InterestCards";
import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import SelectBase from "Components/SelectBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";

export default function InterestListing() {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true)
            try {
                const information = await socialAssistantService.getAllAnnouncements()
                setAnnouncements(information.announcements.map(e => ({ value: e.id, label: e.name })))
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
            <div style={{ maxWidth: 'max(25%,300px)' }}>

                <SelectBase
                    error={null}
                    options={announcements}
                    label="Selecione um edital"
                    onChange={(e) => setSelectedAnnouncement(e)}
                />
            </div>
            <InterestCards
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