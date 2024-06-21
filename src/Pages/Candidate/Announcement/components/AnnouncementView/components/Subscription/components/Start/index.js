import { useContext, useEffect, useState } from "react";
import AnnouncementContext from "../../../../context/announcementContext";
import BackPageTitle from "Components/BackPageTitle";
import { ReactComponent as Siren } from 'Assets/icons/siren.svg'
import Card from "Components/Card";
import styles from './styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { Link } from "react-router-dom";
import candidateService from "services/candidate/candidateService";
export default function StartSubscription() {
    const { move, id } = useContext(AnnouncementContext)
    const [pdf, setPdf] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = await candidateService.getAnnouncementPdf(id)
                setPdf(url)
            } catch (err) {

            }
        }
        fetchData()
    }, [])

    return (
        <>
            <BackPageTitle title={'inscrição em processo seletivo'} onClick={() => move('INITIAL')} />
            <div className={styles.card}>
                <Card.Root width={'max(30%, 300px)'}>
                    <Card.Header>
                        <Siren />
                        <h1>Atenção</h1>
                    </Card.Header>
                    <Card.Content>
                        A bolsa de estudos terá validade para o ano letivo de {2024},
                        com a renovação anual através de seleção. A concessão
                        de bolsa de estudo estará sujeita à disponibilidade de vagas
                        na unidade escolar solicitada e ao perfil socioeconômico
                        compatível às exigências da Lei Complementar nº 187/2021.
                    </Card.Content>
                </Card.Root>
            </div>
            <div className={styles.content}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', height: '100%' }}>
                    <div >
                        <h2 style={{ textAlign: 'center' }}>Compromisso em comunicar eventual alteração no tamanho do grupo familiar e/ou renda</h2>
                        <span>
                            Tenho ciência de que devo comunicar o(a) assistente social da entidade beneficente sobre nascimento ou falecimento de membro do meu grupo familiar,
                            desde que morem na mesma residência, bem como sobre eventual rescisão de contrato de trabalho, encerramento de atividade que gere renda ou sobre início em
                            novo emprego ou atividade que gere renda para um dos membros, pois altera a aferição realizada e o benefício em decorrência da nova renda familiar bruta
                            mensal pode ser ampliado, reduzido ou mesmo cancelado, após análise por profissional de serviço social.
                        </span>
                    </div>
                    <div>
                        <h2 style={{ textAlign: 'center' }}>Inteira responsabilidade pelas informações contidas neste cadastro</h2>
                        <span>
                            Estou ciente e assumo, inteira responsabilidade pelas informações contidas neste cadastro e em relação as informações prestadas no decorrer do preenchimento deste
                            formulário eletrônico e documentos anexados, estando consciente que a falsidade nas informações implicará nas penalidades cabíveis, previstas nos artigos 298 e 299 do
                            Código Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
                        </span>
                    </div>
                    {pdf && <Link to={pdf} target="_blank">
                        <ButtonBase label={'visualizar PDF do edital'} />
                    </Link>}
                </div>
                <ButtonBase label={'continuar'} onClick={() => move('FORM')} />
            </div >
        </>
    )
}