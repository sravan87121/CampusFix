import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserDashboard } from '../services/dashboardService';
import TicketCard from '../components/TicketCard';

export default function UserDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { getUserDashboard().then(setData); }, []);

  if (!data) return <p className="text-gray-500">Loading...</p>;

  const stats = [
    { label: 'Total Tickets', value: data.myTotalTickets },
    { label: 'Open', value: data.open },
    { label: 'In Progress', value: data.inProgress },
    { label: 'Resolved', value: data.resolved },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Link to="/tickets/new" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
          + Report New Issue
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-3xl font-bold text-brand-600">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <h2 className="font-semibold mb-3">Recent Tickets</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.recentTickets.map((t) => <TicketCard key={t._id} ticket={t} />)}
      </div>
    </div>
  );
}
