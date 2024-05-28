import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Portal from 'Components/Portal'
import Overlay from 'Components/Overlay'
import ButtonBase from 'Components/ButtonBase'
export default function LGPD() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleModal = () => {
        setIsModalOpen((prev) => !prev)
    }
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'

        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen])
    //TODO : turn the LGPD overlay into another component (maybe modal with composition pattern)
    return (
        <>
            <div className={styles.badge} onClick={handleModal}>LGPD</div>
            {
                isModalOpen && (
                    <Portal id={"lgpd"}>
                        <Overlay>
                            <div className={styles.modal}>
                                <div >
                                    <strong>DO TRATAMENTO E PROTEÇÃO DE DADOS PESSOAIS COM SEU CONSENTIMENTO</strong>

                                    <p>O tratamento de dados pessoais e sensíveis realizado pela CADASTRAQUI está de acordo com a legislação relativa à privacidade e à proteção de dados pessoais no
                                        Brasil, tais como a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), as leis e normas setoriais, a Lei nº 12.965/2014 e o Decreto nº 8771/16;
                                        bem como se dará nos termos dos Editais de Seleção ou Manutenção de Bolsa de Estudo, concedidas ou mantidas nos termos da Lei Complementar nº 187, de 16 de
                                        dezembro de 2021. A finalidade específica do tratamento dos dados é a seleção de beneficiários de bolsas de estudo integrais e parciais com 50%
                                        (cinquenta por cento) de gratuidade, com base em critérios socioeconômicos.</p>

                                    <p>Ao realizar o processo de preenchimento do formulário eletrônico, bem como o upload da documentação exigida, os candidatos(as)/alunos(as) maiores de idade,
                                        os pais e/ou responsáveis legais de candidatos(as) ou alunos(as) já beneficiários autorizam a CADASTRAQUI acessar e a disponibilizar as informações à
                                        INSTITUIÇÃO DE ENSINO de sua escolha para que esta realize o tratamento dos dados pessoais e sensíveis e esta poderá comunicar ou transferir em parte,
                                        ou na sua totalidade, os dados pessoais do candidato, familiares, representantes legais, a entidades públicas e/ou privadas, sempre que o fornecimento dos
                                        respectivos dados decorra de obrigação legal e/ou seja necessário para o cumprimento do Edital aberto. Cabe ressaltar, que a INSTITUIÇÃO DE ENSINO presta contas
                                        de seus processos seletivos (como: quantidade de inscritos, aprovados e indeferidos) e beneficiários de suas bolsas de estudo ao Ministério da Educação.</p>

                                    <p>A CADASTRAQUI fará o arquivo da documentação que instruiu o processo de seleção de candidatos (novos alunos ou renovação) para a concessão da gratuidade
                                        integral ou parcial com 50% (cinquenta por cento de gratuidade) pelo prazo de 10 (dez) anos, a contar do encerramento dos prazos de que trata cada Edital,
                                        conforme determina a Lei Complementar nº 187, de 16 de dezembro de 2021, facultando a INSTITUIÇÃO DE ENSINO obter cópia para manter arquivo secundário.</p>

                                    <p>A CADASTRAQUI firmou acordo de confidencialidade com seus colaboradores, prepostos, subcontratados e outros que possam ter acesso às informações sobre o dever
                                        de confidencialidade e sigilo.</p>

                                    <p>As informações constantes do formulário eletrônico, da análise técnica dos documentos apresentados e da análise da condição social dos alunos não
                                        selecionados serão submetidas ao processo de anonimização pela CADASTRAQUI e após o cumprimento do prazo legal de guarda e arquivo, as informações prestadas e
                                        arquivos de upload de documentos serão eliminados, através de procedimentos seguros que garantam a exclusão das informações.</p>

                                    <p>É garantido aos usuários maiores de idade e representantes legais o exercício de todos os direitos, nos termos do art. 18 da Lei Geral de Proteção de Dados,
                                        bem como o livre acesso aos dados pessoais do(a) CANDIDATO(A)/ALUNO(A), especialmente em razão da obrigação destes em manter os dados atualizados,
                                        mediante procedimento de login no sistema.</p>

                                    <p>Em casos de violação de dados pessoais, a controladora, comunicará o fato aos titulares de dados e a Autoridade Nacional de Proteção de Dados – ANPD,
                                        atendendo aos termos e condições previstos na Lei Geral de Proteção de Dados.</p>

                                    <p>Para esclarecimentos adicionais, dúvidas ou sugestões, sobre o sistema CADASTRAQUI, solicita-se o envio pelo SAC disponível no sistema.</p>
                                </div>
                                <div className={styles.actions}>

                                    <ButtonBase label={'voltar'} onClick={handleModal} />
                                </div>
                            </div>
                        </Overlay>
                    </Portal>
                )
            }
        </>
    )
}