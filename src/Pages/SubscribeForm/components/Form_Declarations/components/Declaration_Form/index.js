import React from 'react';
import commonStyles from '../../styles.module.scss'; // Importação ajustada
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_Form({ onBack, onEdit }) {
    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>João da Silva - usuário do cadastraqui</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>João da Silva</span>, portador(a) da cédula de identidade RG nº <span>123456-85</span>, órgão emissor <span>SSP</span>, UF do órgão emissor <span>RJ</span> ou portador(a) da <span>CNH</span>, número <span>598765421-5</span>, validade <span>12/12/2024</span>, inscrito(a) no <span>CPF</span> nº <span>123.321.456-87</span>, nacionalidade <span>brasileira</span>, estado civil <span>casado</span>, profissão <span>mecânico</span>, residente na <span>rua do império</span>, nº <span>598</span>, complemento, <span>CEP: 23451-012</span>, bairro Flores, cidade <span>Rio de Janeiro</span>, estado <span>Rio de Janeiro</span>, UF <span>RJ</span>, e-mail: <span>joao.silva@test.com</span>, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:
                </p>
                <div className={commonStyles.radioGroup}>
                    <label>Todas as informações estão corretas?</label>
                    <div>
                        <input type="radio" id="yes" name="infoCorrect" value="yes" />
                        <label htmlFor="yes">Sim</label>
                        <input type="radio" id="no" name="infoCorrect" value="no" />
                        <label htmlFor="no">Não</label>
                    </div>
                </div>
                <ButtonBase label="Editar" onClick={onEdit} />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
            </div>
        </div>
    );
}
