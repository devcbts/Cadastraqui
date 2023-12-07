import React, { useState } from 'react';
import { api } from '../../services/axios';
import imovelCedidoPDF from '../../Assets/imovel-cedido.pdf'; // Importando o arquivo PDF
import auxilioTerceirosPDF from '../../Assets/auxilio-terceiros.pdf'; // Importando o arquivo PDF
import declaracaoCandidatoResponsavelPDF from '../../Assets/candidato-responsavel-declaracao.pdf'; // Importando o arquivo PDF
import declaracaoGrupoFamiliarPDF from '../../Assets/declaracao-grupo-familiar.pdf'; // Importando o arquivo PDF

const DECLARATION_CATEGORIES = {
    responsavelLegal: "Declaração de Responsável Legal ou Candidato Maior de Idade",
    grupoFamiliar: "Declaração de Integrante do Grupo Familiar",
    auxilioTerceiros: "Declaração de Auxílio de Terceiros",
    imovelCedido: "Declaração de Imóvel Cedido",
    // Outras categorias podem ser adicionadas conforme necessário
};

export default function EnviarDeclaracoes({ id }) {
    const [declaracoes, setDeclaracoes] = useState({
        responsavelLegal: [],
        grupoFamiliar: [],
        auxilioTerceiros: [],
        imovelCedido: [],
        // Outras categorias podem ser adicionadas conforme necessário
    });

    const handleFileChange = (e, category) => {
        setDeclaracoes({
            ...declaracoes,
            [category]: [...declaracoes[category], e.target.files[0]]
        });
    };

    const enviarDeclaracao = async (tipo, file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", tipo);
        const token = localStorage.getItem('token');

        try {
            const response = await api.post(`/candidates/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // Trate a resposta conforme necessário
            alert("Declaração Enviada!");
        } catch (error) {
            // Trate o erro conforme necessário
            alert("Erro ao enviar declaração!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Object.keys(declaracoes).forEach(categoria => {
            declaracoes[categoria].forEach(file => {
                enviarDeclaracao(categoria, file);
            });
        });
    };

    const pdfLinks = {
        responsavelLegal: declaracaoCandidatoResponsavelPDF,
        grupoFamiliar: declaracaoGrupoFamiliarPDF,
        auxilioTerceiros: auxilioTerceirosPDF,
        imovelCedido: imovelCedidoPDF
    };

    return (
        <div className='fill-box' >
            <form onSubmit={handleSubmit} id='survey-form'>
                {Object.entries(DECLARATION_CATEGORIES).map(([categoryKey, categoryLabel]) => (
                    <div key={categoryKey} className='survey-box'>
                        <h2>{categoryLabel}</h2>

                        <a href={pdfLinks[categoryKey]} target="_blank" rel="noopener noreferrer">
                            Visualizar {categoryLabel}
                        </a>
                        <input
                            type="file"
                            accept=".pdf"
                            className='survey-control'
                            style={{ marginLeft: '145px' }}

                            onChange={(e) => handleFileChange(e, categoryKey)}
                        />
                        <button type="button" onClick={() => declaracoes[categoryKey].forEach(file => enviarDeclaracao(categoryKey, file))}>
                            Enviar Declaração
                        </button>
                    </div>
                ))}
            </form>
        </div>
    );
};
