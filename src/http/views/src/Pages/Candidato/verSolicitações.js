import React from 'react'
import './verSolicitações.css'

export default function VerSolicitacoes() {
    return (
        <div className="container-solicitacoes">
            <header>
                <h1>Seja bem-vindo!</h1>
                <p>Aqui você terá acesso...</p>
            </header>

            <div className="main-content">
                <select>
                    <option>Selecionar candidato</option>
                </select>

                <div className="communication-box">
                    <h2>Solicitações e comunicações enviados pela(o) assistente social</h2>
                    <div className="document-delivery">
                        <h3>Entrega de documentos:</h3>
                        <textarea placeholder="Descrição..."></textarea>
                        <div className="delivery-info">
                            <span>500 caracteres</span>
                            <select>
                                <option>2 dias</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button>PRÓXIMO</button>
            </div>
        </div>
    )
}

