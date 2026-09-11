import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicket, changeStatus, resolveTicket } from '../services/ticketService';
import { getComments, addComment } from '../services/commentService';
import CommentBox from '../components/CommentBox';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import useAuth from '../hooks/useAuth';

const TIMELINE = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    getTicket(id).then(setTicket).catch(() => setError('Could not load ticket'));
    getComments(id).then(setComments).catch(() => {});
  };

  useEffect(load, [id]);

  const handleComment = async (message) => {
    await addComment(id, message);
    getComments(id).then(setComments);
  };

  const canManage = user && ticket && (user.role === 'ADMIN' || (user.role === 'STAFF' && ticket.assignedTo?._id === user._id));

  const handleStatusChange = async (status) => {
    await changeStatus(id, status);
    load();
  };

  const handleResolve = async () => {
    const data = new FormData();
    data.append('resolutionNotes', notes);
    await resolveTicket(id, data);
    load();
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!ticket) return <p className="text-gray-500">Loading...</p>;

  const timelineIndex = TIMELINE.indexOf(ticket.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-sm text-gray-500">{ticket.ticketId}</span>
          <div className="flex gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2">{ticket.title}</h1>
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <p><strong>Category:</strong> {ticket.category?.name}</p>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Created by:</strong> {ticket.createdBy?.name}</p>
          <p><strong>Assigned to:</strong> {ticket.assignedTo?.name || 'Unassigned'}</p>
          <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
        </div>

        {ticket.attachments?.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {ticket.attachments.map((a) => (
              <img key={a.filename} src={a.url} alt="attachment" className="w-24 h-24 object-cover rounded-lg border" />
            ))}
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500">
            {TIMELINE.map((step, i) => (
              <span key={step} className={i <= timelineIndex ? 'text-brand-600 font-semibold' : ''}>
                {step === 'IN_PROGRESS' ? 'In Progress' : step.charAt(0) + step.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full mt-2">
            <div
              className="h-1.5 bg-brand-600 rounded-full transition-all"
              style={{ width: `${(Math.max(timelineIndex, 0) / (TIMELINE.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {canManage && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <h3 className="font-semibold text-sm">Staff actions</h3>
            <div className="flex gap-2 flex-wrap">
              {ticket.status === 'ASSIGNED' && (
                <button onClick={() => handleStatusChange('IN_PROGRESS')} className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg">Start Work</button>
              )}
            </div>
            {ticket.status === 'IN_PROGRESS' && (
              <div className="flex gap-2">
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Resolution notes"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <button onClick={handleResolve} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">Mark Resolved</button>
              </div>
            )}
            {ticket.status === 'RESOLVED' && user.role === 'ADMIN' && (
              <button onClick={() => handleStatusChange('CLOSED')} className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg">Close Ticket</button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Comments</h3>
        <CommentBox comments={comments} onSubmit={handleComment} />
      </div>
    </div>
  );
}
