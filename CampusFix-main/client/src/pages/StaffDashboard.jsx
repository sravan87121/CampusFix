import { useEffect, useState } from 'react';
import { getStaffDashboard } from '../services/dashboardService';

export default function StaffDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { getStaffDashboard().then(setData); }, []);
  if (!data) return <p className="text-gray-500">Loading...</p>;

  const stats = [
    { label: 'Assigned Tickets', value: data.assigned },
    { label: 'Pending', value: data.pending },
    { label: 'In Progress', value: data.inProgress },
    { label: 'Resolved', value: data.resolved },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-3xl font-bold text-brand-600">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
