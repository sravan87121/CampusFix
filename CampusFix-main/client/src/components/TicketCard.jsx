import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-brand-200 transition"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-500">{ticket.ticketId}</span>
        <div className="flex gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
      <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
        <span>{ticket.category?.name}</span>
        <span>{ticket.location}</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
