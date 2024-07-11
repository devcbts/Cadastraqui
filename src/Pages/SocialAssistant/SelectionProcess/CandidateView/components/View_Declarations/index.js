import ButtonBase from 'Components/ButtonBase';
import Loader from 'Components/Loader';
import FormListItem from 'Pages/SubscribeForm/components/FormList/FormListItem';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from 'react';
import socialAssistantService from 'services/socialAssistant/socialAssistantService';

export default function ViewDeclarations({ applicationId }) {
    const [declarations, setDeclarations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const info = await socialAssistantService.getDeclarations(applicationId)
                setDeclarations(info)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            <div>
                <h1>Declarações do processo seletivo</h1>
                {<div className={commonStyles.declarationSection}>
                    <div className={commonStyles.declarationItem}>
                        {
                            !selectedUser
                                ? (<>
                                    {declarations.map(e => (
                                        <FormListItem.Root text={e.name}>
                                            <FormListItem.Actions>
                                                <ButtonBase label={'visualizar'} onClick={() => setSelectedUser(e)} />
                                            </FormListItem.Actions>
                                        </FormListItem.Root>
                                    ))}
                                </>)
                                : (
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                                        <h3 style={{ textAlign: 'center' }}> {selectedUser.name}</h3>
                                        <div>
                                            {
                                                Object.entries(selectedUser?.urls).map(([k, v]) => {
                                                    const fileName = k.split('_')[1]
                                                    let name;
                                                    switch (fileName.toLowerCase()) {
                                                        case 'mei':
                                                            name = 'Documento MEI';
                                                            break
                                                        case 'carteira-de-trabalho':
                                                            name = 'Carteira de Trabalho';
                                                            break
                                                        case 'ir':
                                                            name = 'Documento de imposto de renda'
                                                            break;
                                                        case 'cnis':
                                                            name = 'Documento CNIS'
                                                            break
                                                        case 'declaracoes':
                                                            name = 'Declarações'
                                                            break
                                                    }
                                                    return (
                                                        <FormListItem.Root text={name}>
                                                            <FormListItem.Actions>
                                                                <ButtonBase label={'visualizar'} onClick={() => window.open(v, '_blank')} />
                                                            </FormListItem.Actions>
                                                        </FormListItem.Root>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                </div>
                }

            </div>
        </div>
    )
}