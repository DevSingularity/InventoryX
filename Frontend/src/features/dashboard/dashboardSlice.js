import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  stats: {
    totalItems: 0,
    lowStockItems: 0,
    inStockItems: 0,
    outOfStock: 0,
    totalEmployees: 0,
    activePcbs: 0,
    totalProductionQuantity: 0,
    pendingProcurement: 0,
  },
  topConsumed: [],
  lowStockComponents: [],
  pcbProductionSummary: [],
  componentConsumptionSummary: [],
  procurementStatus: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const getDashboardOverview = createAsyncThunk(
  'dashboard/getOverview',
  async (_, thunkAPI) => {
    try {
      const role = thunkAPI.getState()?.auth?.user?.role;
      const isAdmin = String(role || '').toLowerCase() === 'admin';

      const requests = [
        api.get('/dashboard/stats'),
        api.get('/dashboard/top-consumed-components'),
        api.get('/dashboard/low-stock-components'),
        api.get('/dashboard/pcb-production-summary'),
        api.get('/dashboard/component-consumption-summary'),
        api.get('/procurement'),
        api.get('/components'),
      ];

      if (isAdmin) {
        requests.push(api.get('/users/employees'));
      }

      const [
        statsRes,
        topConsumedRes,
        lowStockRes,
        pcbSummaryRes,
        consumptionSummaryRes,
        procurementRes,
        componentsRes,
        employeesRes,
      ] = await Promise.all(requests);

      const stats = statsRes.data || {};
      const components = componentsRes.data || [];
      const employees = employeesRes?.data || [];

      const totalItems = Number(stats.total_components || 0);
      const lowStockItems = Number(stats.low_stock_components || 0);
      const outOfStock = components.filter(
        (item) => Number(item.current_stock_quantity || 0) === 0
      ).length;
      const inStockItems = Math.max(totalItems - lowStockItems - outOfStock, 0);

      return {
        stats: {
          totalItems,
          lowStockItems,
          inStockItems,
          outOfStock,
          totalEmployees: isAdmin
            ? employees.filter((user) => user.is_active).length
            : 0,
          activePcbs: Number(stats.active_pcbs || 0),
          totalProductionQuantity: Number(stats.total_production_quantity || 0),
          pendingProcurement: Number(stats.pending_procurement_triggers || 0),
        },
        topConsumed: topConsumedRes.data || [],
        lowStockComponents: lowStockRes.data || [],
        pcbProductionSummary: pcbSummaryRes.data || [],
        componentConsumptionSummary: consumptionSummaryRes.data || [],
        procurementStatus: procurementRes.data || [],
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch dashboard overview';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.topConsumed = [];
      state.lowStockComponents = [];
      state.pcbProductionSummary = [];
      state.componentConsumptionSummary = [];
      state.procurementStatus = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardOverview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getDashboardOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.topConsumed = action.payload.topConsumed;
        state.lowStockComponents = action.payload.lowStockComponents;
        state.pcbProductionSummary = action.payload.pcbProductionSummary;
        state.componentConsumptionSummary = action.payload.componentConsumptionSummary;
        state.procurementStatus = action.payload.procurementStatus;
      })
      .addCase(getDashboardOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
