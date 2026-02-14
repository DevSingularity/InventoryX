import { createElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertTriangle,
  Boxes,
  CheckCircle,
  Factory,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardOverview } from './dashboardSlice';
import { LoadingSpinner } from '../../components/ui';
import { useRole } from '../../hooks';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useRole();
  const {
    stats,
    topConsumed,
    lowStockComponents,
    pcbProductionSummary,
    procurementStatus,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.dashboard);

  const loadDashboard = () => {
    dispatch(getDashboardOverview());
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const safeTotal = stats.totalItems || 0;
  const inStockPercentage = safeTotal ? Math.round((stats.inStockItems / safeTotal) * 100) : 0;
  const lowStockPercentage = safeTotal ? Math.round((stats.lowStockItems / safeTotal) * 100) : 0;
  const outOfStockPercentage = safeTotal ? Math.round((stats.outOfStock / safeTotal) * 100) : 0;

  const topConsumedChartData = topConsumed.slice(0, 8).map((item) => ({
    name: item.part_number,
    consumed: item.total_consumed,
  }));

  const productionChartData = pcbProductionSummary.slice(0, 8).map((item) => ({
    name: item.pcb_code || item.pcb_name,
    quantity: item.total_quantity_produced,
  }));

  const procurementCounts = procurementStatus.reduce(
    (acc, item) => {
      const status = String(item.status || '').toLowerCase();
      if (status === 'ordered') acc.ordered += 1;
      else if (status === 'received') acc.received += 1;
      else acc.pending += 1;
      return acc;
    },
    { pending: 0, ordered: 0, received: 0 }
  );

  const procurementPieData = [
    { name: 'Pending', value: procurementCounts.pending, color: 'var(--color-warning)' },
    { name: 'Ordered', value: procurementCounts.ordered, color: 'var(--color-primary-500)' },
    { name: 'Received', value: procurementCounts.received, color: 'var(--color-success)' },
  ];
  const procurementTotal = procurementPieData.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (value) => Number(value || 0).toLocaleString();

  const chartTooltipStyle = {
    borderRadius: 10,
    border: '1px solid var(--border)',
    backgroundColor: 'var(--card)',
    color: 'var(--text)',
  };

  const kpiCards = [
    { title: 'Total Components', value: stats.totalItems, icon: Package, tone: 'primary' },
    { title: 'In Stock', value: stats.inStockItems, icon: CheckCircle, tone: 'success' },
    { title: 'Low Stock', value: stats.lowStockItems, icon: AlertTriangle, tone: 'warning' },
    { title: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, tone: 'danger' },
    {
      title: 'Total Production',
      value: formatNumber(stats.totalProductionQuantity),
      icon: Factory,
      tone: 'primary',
    },
    { title: 'Pending Procurement', value: stats.pendingProcurement, icon: ShoppingCart, tone: 'warning' },
    { title: 'Active PCBs', value: stats.activePcbs, icon: Boxes, tone: 'primary' },
    ...(isAdmin
      ? [{ title: 'Active Employees', value: stats.totalEmployees, icon: Users, tone: 'primary' }]
      : []),
  ];

  const toneClasses = {
    primary: 'bg-primary-50 text-primary-500',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  const toneCardClasses = {
    primary: 'border-primary-100 bg-linear-to-br from-primary-50 to-white',
    success: 'border-success/20 bg-linear-to-br from-success/10 to-white',
    warning: 'border-warning/20 bg-linear-to-br from-warning/10 to-white',
    danger: 'border-danger/20 bg-linear-to-br from-danger/10 to-white',
  };

  const toneValueClasses = {
    primary: 'text-primary-700',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className="space-y-8">
      <section className="card p-6 md:p-8 border-primary-100 bg-linear-to-r from-primary-100 via-primary-50 to-secondary-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-secondary-600 max-w-2xl">
              Unified monitoring for inventory health, production throughput, and procurement lifecycle.
            </p>
          </div>
          <button className="btn btn-primary inline-flex items-center gap-2" onClick={loadDashboard}>
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>

        {isError && (
          <div className="mt-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {message || 'Failed to load dashboard data'}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiCards.map(({ title, value, icon, tone }) => (
          <article key={title} className={`card p-5 ${toneCardClasses[tone]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-secondary-600">{title}</p>
                <p className={`mt-2 text-3xl font-bold leading-none ${toneValueClasses[tone]}`}>{value}</p>
              </div>
              <div className={`rounded-xl p-2.5 ${toneClasses[tone]}`}>
                {createElement(icon, { size: 20 })}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <article className="card border-primary-100 bg-linear-to-br from-primary-50 to-white">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Top Consumed Components</h2>
              <p className="text-sm text-secondary-600">Most consumed part numbers by transaction history</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topConsumedChartData} margin={{ left: 0, right: 12, top: 8, bottom: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--secondary-200)" />
                  <XAxis dataKey="name" angle={-32} textAnchor="end" height={66} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="consumed" fill="var(--primary-500)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card border-success/20 bg-linear-to-br from-success/10 to-white">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">PCB Production Output</h2>
              <p className="text-sm text-secondary-600">Top boards by cumulative quantity produced</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionChartData} margin={{ left: 0, right: 12, top: 8, bottom: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--secondary-200)" />
                  <XAxis dataKey="name" angle={-32} textAnchor="end" height={66} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="quantity" fill="var(--color-success)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card overflow-x-auto border-danger/15 bg-linear-to-br from-danger/5 to-white">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Low Stock Components</h2>
              <p className="text-sm text-secondary-600">Items near or below safety thresholds</p>
            </div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 text-left">
                  <th className="py-2 pr-3">Part No.</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Current</th>
                  <th className="py-2 pr-3">Monthly Req.</th>
                  <th className="py-2 pr-3">Stock %</th>
                </tr>
              </thead>
              <tbody>
                {lowStockComponents.slice(0, 10).map((item, index) => (
                  <tr
                    key={`${item.part_number || 'part'}-${item.component_name || 'name'}-${index}`}
                    className="border-b border-secondary-100"
                  >
                    <td className="py-2.5 pr-3 font-medium text-secondary-900">{item.part_number}</td>
                    <td className="py-2.5 pr-3 text-secondary-700">{item.component_name}</td>
                    <td className="py-2.5 pr-3 text-secondary-700">{item.current_stock_quantity}</td>
                    <td className="py-2.5 pr-3 text-secondary-700">{item.monthly_required_quantity}</td>
                    <td className="py-2.5 pr-3 text-danger font-semibold">{item.stock_percentage}%</td>
                  </tr>
                ))}
                {!lowStockComponents.length && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-secondary-600">
                      No low-stock components found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </article>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <article className="card border-secondary-200 bg-linear-to-br from-secondary-50 to-white">
            <h2 className="text-lg font-semibold text-secondary-900">Procurement Status</h2>
            <p className="text-sm text-secondary-600 mt-1">Pending → Ordered → Received</p>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-lg border border-warning/25 bg-warning/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-warning">Pending</p>
                <p className="mt-1 text-lg font-semibold text-secondary-900">{procurementCounts.pending}</p>
              </div>
              <div className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-primary-700">Ordered</p>
                <p className="mt-1 text-lg font-semibold text-secondary-900">{procurementCounts.ordered}</p>
              </div>
              <div className="rounded-lg border border-success/25 bg-success/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-success">Received</p>
                <p className="mt-1 text-lg font-semibold text-secondary-900">{procurementCounts.received}</p>
              </div>
            </div>

            <div className="mt-4">
              {procurementTotal > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={procurementPieData} cx="50%" cy="50%" outerRadius={78} dataKey="value" label>
                        {procurementPieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="rounded-lg border border-secondary-200 bg-linear-to-br from-secondary-50 to-primary-50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-secondary-900">No active procurement alerts</p>
                  <p className="mt-1 text-xs text-secondary-600">All components are currently within safe stock limits.</p>
                </div>
              )}
            </div>
          </article>

          <article className="card border-secondary-200 bg-linear-to-br from-secondary-50 to-white">
            <h2 className="text-lg font-semibold text-secondary-900">Inventory Composition</h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-secondary-600">In Stock</span>
                  <span className="font-medium text-secondary-900">{inStockPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary-200">
                  <div className="h-2 rounded-full bg-success" style={{ width: `${inStockPercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Low Stock</span>
                  <span className="font-medium text-secondary-900">{lowStockPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary-200">
                  <div className="h-2 rounded-full bg-warning" style={{ width: `${lowStockPercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Out of Stock</span>
                  <span className="font-medium text-secondary-900">{outOfStockPercentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary-200">
                  <div className="h-2 rounded-full bg-danger" style={{ width: `${outOfStockPercentage}%` }} />
                </div>
              </div>
            </div>
          </article>

          <article className="card border-secondary-200 bg-linear-to-br from-secondary-50 to-white">
            <h2 className="text-lg font-semibold text-secondary-900">Quick Metrics</h2>
            <p className="text-sm text-secondary-600 mt-1">At-a-glance operational highlights</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                <span className="text-secondary-600">Total Components</span>
                <span className="font-semibold text-secondary-900">{stats.totalItems}</span>
              </div>
              <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                <span className="text-secondary-600">Items In Stock</span>
                <span className="font-semibold text-success">{stats.inStockItems}</span>
              </div>
              <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                <span className="text-secondary-600">Low Stock Components</span>
                <span className="font-semibold text-warning">{stats.lowStockItems}</span>
              </div>
              <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                <span className="text-secondary-600">Total Production Quantity</span>
                <span className="font-semibold text-secondary-900">{formatNumber(stats.totalProductionQuantity)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Pending Procurement Alerts</span>
                <span className="font-semibold text-danger">{stats.pendingProcurement}</span>
              </div>
            </div>
          </article>

          <article className="card overflow-x-auto border-primary-100 bg-linear-to-br from-primary-50 to-white">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Top Consumed (Table)</h2>
              <p className="text-sm text-secondary-600">Consumption volume with stock state</p>
            </div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 text-left">
                  <th className="py-2 pr-3">Part No.</th>
                  <th className="py-2 pr-3">Consumed</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topConsumed.slice(0, 10).map((item, index) => (
                  <tr
                    key={`${item.part_number || 'part'}-${item.component_name || 'name'}-${index}`}
                    className="border-b border-secondary-100"
                  >
                    <td className="py-2.5 pr-3">
                      <p className="font-medium text-secondary-900">{item.part_number}</p>
                      <p className="text-xs text-secondary-600">{item.component_name}</p>
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-secondary-900">
                      {formatNumber(item.total_consumed)}
                    </td>
                    <td className="py-2.5 pr-3">
                      {item.is_low_stock ? (
                        <span className="px-2 py-1 rounded-md bg-danger/10 text-danger text-xs font-semibold">
                          Low
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-success/10 text-success text-xs font-semibold">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!topConsumed.length && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-secondary-600">
                      No consumption data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
