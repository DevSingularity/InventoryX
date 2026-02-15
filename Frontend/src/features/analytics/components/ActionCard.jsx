import React from 'react';
import styles from '../styles/ExcelImportExport.module.css';

const ActionCard = ({ title, description, icon, buttonText, buttonVariant = 'primary', onClick, loading }) => {
    const isSuccess = buttonVariant === 'success';

    return (
        <div className={styles.actionCard}>
            <div className={`${styles.iconContainer} ${isSuccess ? styles.iconContainerGreen : styles.iconContainerBlue}`}>
                {icon}
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
            <button
                className={`${styles.actionButton} ${isSuccess ? styles.successButton : styles.primaryButton}`}
                onClick={onClick}
                disabled={loading}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default ActionCard;
