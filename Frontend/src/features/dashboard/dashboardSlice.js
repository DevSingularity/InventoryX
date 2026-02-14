import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  stats: {
    totalItems: 0,
    lowStockItems: 0,
    totalEmployees: 0,
    outOfStock: 0,
  },
  isLoading: false,
  isError: false,
  message: '',
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, thunkAPI) => {
    try {
      const [statsRes, componentsRes, usersRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/components'),
        api.get('/users'),
      ]);

      const stats = statsRes.data;
      const components = componentsRes.data || [];
      const users = usersRes.data || [];

      const totalItems = stats.total_components || 0;
      const lowStockItems = stats.low_stock_components || 0;
      const outOfStock = components.filter((item) => Number(item.current_stock_quantity) === 0).length;
      const totalEmployees = users.filter((user) => user.is_active).length;

      return {
        totalItems,
        lowStockItems,
        outOfStock,
        totalEmployees,
      };
    } catch (error) {
      const message = error.message || 'Failed to fetch dashboard stats';
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
