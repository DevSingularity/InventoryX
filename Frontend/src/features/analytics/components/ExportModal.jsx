import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import { Download, Description, Assessment, Warning, TrendingUp } from '@mui/icons-material';
import styles from '../styles/ExcelImportExport.module.css';

const ExportModal = ({ open, onClose, handleExport, loading }) => {

    const exportOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Export all component data including stock levels and consumption',
            icon: <Description fontSize="small" color="primary" />,
        },
        {
            type: 'consumption-report',
            title: 'Consumption Report',
            description: 'Export detailed consumption history and analytics',
            icon: <TrendingUp fontSize="small" color="action" />,
        },
        {
            type: 'low-stock-report',
            title: 'Low Stock Report',
            description: 'Export components with low stock levels',
            icon: <Warning fontSize="small" color="error" />,
        },
        {
            type: 'pcb-production',
            title: 'PCB Production Report',
            description: 'Export production history and statistics',
            icon: <Assessment fontSize="small" color="success" />,
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '16px',
                    background: '#FFFFFF',
                }
            }}
        >
            <DialogContent sx={{ padding: '24px' }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Export to Excel</h2>
                    <div className={styles.modalDivider}></div>
                </div>

                <div className={styles.importTypeGrid}>
                    {exportOptions.map((option) => (
                        <div
                            key={option.type}
                            className={styles.typeCard}
                            onClick={() => !loading && handleExport(option.type)}
                            style={{ cursor: loading ? 'wait' : 'pointer' }}
                        >
                            <div className={styles.typeCardTitle} style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {option.icon}
                                    {option.title}
                                </div>
                                <Download fontSize="small" sx={{ color: '#CBD5E1' }} />
                            </div>
                            <div className={styles.typeCardDesc}>
                                {option.description}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExportModal;
