import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Upload as UploadIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { Alert } from '@mui/material';

import api from '../../services/api';
import styles from './styles/ExcelImportExport.module.css';

import ImportExportHeader from './components/ImportExportHeader';
import ActionCard from './components/ActionCard';
import GuidelinesSection from './components/GuidelinesSection';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';

const ExcelImportExport = () => {
    // const dispatch = useDispatch(); // Not used in original logic, but kept in imports just in case

    // State
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importType, setImportType] = useState('components');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Handlers
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please select a valid Excel file (.xlsx or .xls)');
                setSelectedFile(null);
            }
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setError('Please select a file to import');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('import_type', importType);

        try {
            const response = await api.post('/import/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data);
            setSelectedFile(null);
            // File input ref reset is handled inside Modal if needed, or by causing re-render
            setOpenImportDialog(false); // Close dialog on success
        } catch (err) {
            setError(err.response?.data?.message || 'Error importing file');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (exportType) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/export/${exportType}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${exportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setResult({
                success: true,
                message: `${exportType} exported successfully`,
            });
            // setOpenExportDialog(false); // Optional: close dialog after export
        } catch (err) {
            setError(err.response?.data?.message || 'Error exporting data');
        } finally {
            setLoading(false);
        }
    };

    const importOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Import component master data with part numbers, quantities, and requirements',
            icon: <Description color="primary" />,
        },
        {
            type: 'pcb_master_bom',
            title: 'PCB Master + BOM Mapping',
            description: 'Bulk import PCB master and component-to-PCB BOM mapping in one file',
            icon: <Assessment color="primary" />,
        },
        {
            type: 'pcb_production',
            title: 'PCB Production Data',
            description: 'Import production records with batch numbers and quantities',
            icon: <Assessment color="primary" />,
        },
    ];

    const exportOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Export all component data including stock levels and consumption',
        },
        {
            type: 'consumption-report',
            title: 'Consumption Report',
            description: 'Export detailed consumption history and analytics',
        },
        {
            type: 'low-stock-report',
            title: 'Low Stock Report',
            description: 'Export components with low stock levels',
        },
        {
            type: 'pcb-production',
            title: 'PCB Production Report',
            description: 'Export production history and statistics',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Excel Import & Export
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {result && (
                <Alert
                    severity={result.success ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                    onClose={() => setResult(null)}
                >
                    {result.message}
                    {result.records_imported > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Records imported: {result.records_imported}
                            {result.records_failed > 0 && ` | Failed: ${result.records_failed}`}
                        </Typography>
                    )}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Import Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <UploadIcon sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
                            <Typography variant="h5">Import Data</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Upload Excel files to import component inventory or production data.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => setOpenImportDialog(true)}
                            fullWidth
                            size="large"
                        >
                            Import from Excel
                        </Button>
                    </Paper>
                </Grid>

                {/* Export Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <DownloadIcon sx={{ mr: 1, fontSize: 32, color: 'success.main' }} />
                            <Typography variant="h5">Export Data</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Download inventory and consumption reports in Excel format.
                        </Typography>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={() => setOpenExportDialog(true)}
                            fullWidth
                            size="large"
                        >
                            Export to Excel
                        </Button>
                    </Paper>
                </Grid>

                {/* Import Guidelines */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Import Guidelines
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Component Import"
                                    secondary="Required columns: Component Name, Part Number, Current Stock Quantity, Monthly Required Quantity"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="PCB Master + BOM Import"
                                    secondary="Required columns: PCB Code, PCB Name, Component Part Number, Quantity Per PCB"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="PCB Production Import"
                                    secondary="Required columns: PCB Code, Quantity Produced, Production Date, Batch Number"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="File Format"
                                    secondary="Supported formats: .xlsx, .xls | Maximum file size: 10MB"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Import Dialog */}
            <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Import from Excel</DialogTitle>
                <DialogContent>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Select import type:
                        </Typography>
                        <Grid container spacing={2}>
                            {importOptions.map((option) => (
                                <Grid item xs={12} sm={6} key={option.type}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: importType === option.type ? '2px solid' : '1px solid',
                                            borderColor: importType === option.type ? 'primary.main' : 'divider',
                                        }}
                                        onClick={() => setImportType(option.type)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                {option.icon}
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    {option.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {option.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                        >
                            {selectedFile ? selectedFile.name : 'Choose File'}
                        </Button>
                        {selectedFile && (
                            <Chip
                                label={`${(selectedFile.size / 1024).toFixed(2)} KB`}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImportDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={!selectedFile || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
                    >
                        {result.message}
                        {result.records_imported > 0 && (
                            <div style={{ marginTop: '4px', fontSize: '0.875rem' }}>
                                Records imported: {result.records_imported}
                                {result.records_failed > 0 && ` | Failed: ${result.records_failed}`}
                            </div>
                        )}
                    </Alert>
                )}

                <div className={styles.cardsRow}>
                    <ActionCard
                        title="Import Data"
                        description="Upload Excel files to import your component inventory or production data seamlessly."
                        icon={<UploadIcon />}
                        buttonText="Import from Excel"
                        buttonVariant="primary"
                        onClick={() => setOpenImportDialog(true)}
                    />

                    <ActionCard
                        title="Export Data"
                        description="Download detailed inventory, consumption, and production reports in Excel format."
                        icon={<DownloadIcon />}
                        buttonText="Export to Excel"
                        buttonVariant="success"
                        onClick={() => setOpenExportDialog(true)}
                    />
                </div>

                <GuidelinesSection />

            </div>

            <ImportModal
                open={openImportDialog}
                onClose={() => setOpenImportDialog(false)}
                importType={importType}
                setImportType={setImportType}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                handleImport={handleImport}
                loading={loading}
            />

            <ExportModal
                open={openExportDialog}
                onClose={() => setOpenExportDialog(false)}
                handleExport={handleExport}
                loading={loading}
            />
        </div>
    );
};

export default ExcelImportExport;
