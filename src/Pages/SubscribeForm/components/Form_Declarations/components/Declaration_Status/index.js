import React from 'react';
import styles from '../../styles.module.scss';
import Card from '../Declaration_Card/index'; // Supondo que Card é um componente que você já tem ou criará

const declarations = [
    { id: 1, label: 'Certificado', status: 'Em dia' },
    { id: 2, label: 'Certificado', status: 'Atualizar' },
    { id: 3, label: 'Certificado', status: 'Pendente' },
    // outros cartões...
];

export default function DeclarationOverview() {
    const groupedDeclarations = {
        inDate: declarations.filter(decl => decl.status === 'Em dia'),
        toUpdate: declarations.filter(decl => decl.status === 'Atualizar'),
        pending: declarations.filter(decl => decl.status === 'Pendente')
    };

    return (
        <div className={styles.container}>
            <h1>Declarações para fins de processo seletivo CEAS</h1>
            <h2>João da Silva - usuário do cadastrAqui</h2>
            <section>
                <h3>Em dia</h3>
                <div className={styles.cardsContainer}>
                    {groupedDeclarations.inDate.map(decl => <Card key={decl.id} label={decl.label} status={decl.status} />)}
                </div>
            </section>
            <section>
                <h3>Atualizar</h3>
                <div className={styles.cardsContainer}>
                    {groupedDeclarations.toUpdate.map(decl => <Card key={decl.id} label={decl.label} status={decl.status} />)}
                </div>
            </section>
            <section>
                <h3>Pendente</h3>
                <div className={styles.cardsContainer}>
                    {groupedDeclarations.pending.map(decl => <Card key={decl.id} label={decl.label} status={decl.status} />)}
                </div>
            </section>
        </div>
    );
}
