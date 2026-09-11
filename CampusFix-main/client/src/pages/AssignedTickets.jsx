import { useEffect, useState } from 'react';
import { getAssignedTickets } from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import Pagination from '../components/Pagination';

export default function AssignedTickets() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getAssignedTickets({ page, limit: 10 }).then((d) => {
      setTickets(d.tickets);
      setTotalPages(d.totalPages);
    });
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assigned Tickets</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {tickets.map((t) => <TicketCard key={t._id} ticket={t} />)}
      </div>
      {tickets.length === 0 && <p className="text-gray-400 mt-4">No tickets assigned to you.</p>}
      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
