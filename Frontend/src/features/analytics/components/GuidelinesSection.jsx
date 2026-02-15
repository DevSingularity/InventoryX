import React from 'react';
import { CheckCircle } from '@mui/icons-material';
import styles from '../styles/ExcelImportExport.module.css';

const GuidelinesSection = () => {
    return (
        <div className={styles.guidelinesContainer}>
            <h3 className={styles.guidelinesTitle}>Import Guidelines</h3>
            <div className={styles.guidelinesList}>
                <div className={styles.guidelineItem}>
                    <CheckCircle className={styles.checkIcon} fontSize="small" />
                    <div className={styles.guidelineContent}>
                        <div className={styles.guidelineHeading}>Component Import</div>
                        <div className={styles.guidelineText}>
                            Required columns: Component Name, Part Number, Current Stock Quantity, Monthly Required Quantity
                        </div>
                    </div>
                </div>
                <div className={styles.guidelineItem}>
                    <CheckCircle className={styles.checkIcon} fontSize="small" />
                    <div className={styles.guidelineContent}>
                        <div className={styles.guidelineHeading}>PCB Production Import</div>
                        <div className={styles.guidelineText}>
                            Required columns: PCB Code, Quantity Produced, Production Date, Batch Number
                        </div>
                    </div>
                </div>
                <div className={styles.guidelineItem}>
                    <CheckCircle className={styles.checkIcon} fontSize="small" />
                    <div className={styles.guidelineContent}>
                        <div className={styles.guidelineHeading}>File Format</div>
                        <div className={styles.guidelineText}>
                            Supported formats: .xlsx, .xls | Maximum file size: 10MB
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidelinesSection;
