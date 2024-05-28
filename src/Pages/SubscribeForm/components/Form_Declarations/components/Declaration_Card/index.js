import React from 'react';
import styles from '../../styles.module.scss';

export default function Card({ label, status }) {
    return (
        <div className={styles.card}>
            <p>{label}</p>
            <div className={styles.status}>{status}</div>
        </div>
    );
}
