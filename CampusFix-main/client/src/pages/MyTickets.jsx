import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import Pagination from '../components/Pagination';
import { STATUSES } from '../utils/constants';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getMyTickets({ page, limit: 10, status: status || undefined }).then((d) => {
      setTickets(d.tickets);
      setTotalPages(d.totalPages);
    });
  }, [page, status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <Link to="/tickets/new" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
          + Report New Issue
        </Link>
      </div>
      <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4">
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="grid gap-4 md:grid-cols-2">
        {tickets.map((t) => <TicketCard key={t._id} ticket={t} />)}
      </div>
      {tickets.length === 0 && <p className="text-gray-400 mt-4">No tickets yet.</p>}
      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
