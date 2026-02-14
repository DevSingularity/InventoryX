import api from '../../services/api';

const ANALYTICS_ENDPOINTS = {
    CONSUMPTION_SUMMARY: '/dashboard/component-consumption-summary',
    TOP_CONSUMED: '/dashboard/top-consumed-components',
    LOW_STOCK: '/dashboard/low-stock-components',
    PCB_PRODUCTION_SUMMARY: '/dashboard/pcb-production-summary',
    PROCUREMENT_STATUS: '/procurement',
};

class AnalyticsService {
    async getConsumptionSummary(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.CONSUMPTION_SUMMARY, { params });
        return response.data;
    }

    async getTopConsumedComponents(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.TOP_CONSUMED, { params });
        return response.data.map((item) => ({
            ...item,
            current_stock_quantity: item.current_stock_quantity ?? 0,
            is_low_stock: item.is_low_stock ?? false,
        }));
    }

    async getLowStockComponents(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.LOW_STOCK, { params });
        return response.data;
    }

    async getPCBProductionSummary(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.PCB_PRODUCTION_SUMMARY, { params });
        return response.data;
    }

    async getConsumptionTrends(params = {}) {
        const response = await api.get(ANALYTICS_ENDPOINTS.CONSUMPTION_SUMMARY, { params });
        return response.data;
    }

    async getStockAlerts() {
        const response = await api.get(ANALYTICS_ENDPOINTS.LOW_STOCK);
        return response.data;
    }

    async getProcurementStatus() {
        const response = await api.get(ANALYTICS_ENDPOINTS.PROCUREMENT_STATUS);
        return response.data;
    }
}

export default new AnalyticsService();
