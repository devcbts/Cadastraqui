import ButtonBase from 'Components/ButtonBase';
import Loader from 'Components/Loader';
import FormListItem from 'Pages/SubscribeForm/components/FormList/FormListItem';
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from 'react';
import socialAssistantService from 'services/socialAssistant/socialAssistantService';

export default function ViewDeclarations({ applicationId }) {
    const [declarations, setDeclarations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
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
                <div className={commonStyles.declarationSection}>
                    <div className={commonStyles.declarationItem}>
                        {
                            declarations.map(e => (
                                <FormListItem.Root text={e.name}>
                                    <FormListItem.Actions>
                                        <ButtonBase label={'baixar'} onClick={() => { }} />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}