import React from 'react';
import styles from '../styles/ExcelImportExport.module.css';

const ImportExportHeader = () => {
    return (
        <div className={styles.headerContainer}>
            <h1 className={styles.pageTitle}>Excel Import & Export</h1>
            <p className={styles.pageSubtitle}>Manage inventory data imports and Excel reports</p>
            <div className={styles.headerDivider}></div>
        </div>
    );
};

export default ImportExportHeader;
