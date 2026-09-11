import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets, assignTicket, changePriority } from '../services/ticketService';
import { getCategories } from '../services/categoryService';
import { getUsers } from '../services/userService';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import { PRIORITIES, STATUSES } from '../utils/constants';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', location: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    const params = { page, limit: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
    getAllTickets(params).then((d) => { setTickets(d.tickets); setTotalPages(d.totalPages); });
  };

  useEffect(load, [page, filters]);
  useEffect(() => { getCategories().then(setCategories); }, []);
  useEffect(() => { getUsers('STAFF').then(setStaffList); }, []);

  const handleAssign = async (id, staffId) => {
    if (!staffId) return;
    await assignTicket(id, staffId);
    load();
  };

  const handlePriority = async (id, priority) => {
    await changePriority(id, priority);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Tickets</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input placeholder="Filter by location" value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned Staff</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-t border-gray-100">
                <td className="p-3 font-mono">
                  <Link to={`/tickets/${t._id}`} className="text-brand-600">{t.ticketId}</Link>
                </td>
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.category?.name}</td>
                <td className="p-3">
                  <select defaultValue={t.priority} onChange={(e) => handlePriority(t._id, e.target.value)}
                    className="border border-gray-200 rounded px-1 py-0.5 text-xs">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="p-3"><StatusBadge status={t.status} /></td>
                <td className="p-3">
                  <select defaultValue={t.assignedTo?._id || ''} onChange={(e) => handleAssign(t._id, e.target.value)}
                    className="border border-gray-200 rounded px-1 py-0.5 text-xs">
                    <option value="">Unassigned</option>
                    {staffList.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
