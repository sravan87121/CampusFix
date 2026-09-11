import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAdminDashboard } from '../services/dashboardService';

const COLORS = ['#2563eb', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#94a3b8'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { getAdminDashboard().then(setData); }, []);
  if (!data) return <p className="text-gray-500">Loading...</p>;

  const kpis = [
    { label: 'Total Tickets', value: data.totalTickets },
    { label: 'Open', value: data.open },
    { label: 'Urgent', value: data.urgent },
    { label: 'In Progress', value: data.inProgress },
    { label: 'Resolved', value: data.resolved },
    { label: 'Avg Resolution (hrs)', value: data.avgResolutionHours },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-brand-600">{k.value}</p>
            <p className="text-xs text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.byCategory}>
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Tickets by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.byPriority} dataKey="count" nameKey="_id" outerRadius={80} label>
                {data.byPriority.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Tickets by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.byStatus}>
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Staff Workload</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.staffWorkload}>
              <XAxis dataKey="staff" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
