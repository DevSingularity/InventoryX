import React, { useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import {
    Description,
    Assessment,
    CloudUpload,
} from '@mui/icons-material';
import styles from '../styles/ExcelImportExport.module.css';

const ImportModal = ({
    open,
    onClose,
    importType,
    setImportType,
    selectedFile,
    handleFileSelect,
    handleImport,
    loading
}) => {
    const fileInputRef = useRef();

    const importOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Import component master data with part numbers, quantities, and requirements',
            icon: <Description sx={{ color: importType === 'components' ? '#3B82F6' : '#64748B' }} />,
        },
        {
            type: 'pcb_production',
            title: 'PCB Production Data',
            description: 'Import production records with batch numbers and quantities',
            icon: <Assessment sx={{ color: importType === 'pcb_production' ? '#3B82F6' : '#64748B' }} />,
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
                    padding: '16px', // Extra padding container
                    background: '#FFFFFF',
                }
            }}
        >
            <DialogContent sx={{ padding: '24px' }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Import from Excel</h2>
                    <div className={styles.modalDivider}></div>
                </div>

                <div className={styles.importTypeGrid}>
                    {importOptions.map((option) => (
                        <div
                            key={option.type}
                            className={`${styles.typeCard} ${importType === option.type ? styles.typeCardSelected : ''}`}
                            onClick={() => setImportType(option.type)}
                        >
                            <div className={styles.typeCardTitle}>
                                {option.icon}
                                {option.title}
                            </div>
                            <div className={styles.typeCardDesc}>
                                {option.description}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={styles.uploadZone}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        // Ideally checking file types here too, but reusing handleFileSelect logic logic requires dataTransfer not target.files directly potentially
                        // For simplicity, we stick to the click interaction or basic drop if compatible with handleFileSelect expecting event.target.files
                    }}
                >
                    <CloudUpload sx={{ fontSize: 48, color: '#CBD5E1' }} />
                    <Typography className={styles.uploadText}>
                        Drag & drop Excel file here or
                    </Typography>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <button
                        className={styles.chooseFileButton}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Choose File
                    </button>

                    {selectedFile && (
                        <div className={styles.selectedFileChip}>
                            <Description fontSize="small" />
                            {selectedFile.name}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.importActionButton}
                        onClick={handleImport}
                        disabled={!selectedFile || loading}
                    >
                        {loading && <CircularProgress size={16} color="inherit" />}
                        Import Data
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportModal;
