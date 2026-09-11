import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { createTicket } from '../services/ticketService';
import { LOCATIONS, PRIORITIES } from '../utils/constants';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', location: LOCATIONS[0], priority: 'MEDIUM' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setError('Could not load categories'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      files.forEach((f) => data.append('attachments', f));
      const ticket = await createTicket(data);
      setSuccess(ticket);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-emerald-600 mb-2">Your maintenance request has been submitted.</h2>
        <p className="text-gray-600 mb-4">Ticket ID: <span className="font-mono font-semibold">{success.ticketId}</span></p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(`/tickets/${success._id}`)} className="px-4 py-2 bg-brand-600 text-white rounded-lg">View Ticket</button>
          <button onClick={() => setSuccess(null)} className="px-4 py-2 border border-gray-300 rounded-lg">Report Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Report a Maintenance Issue</h1>
      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Title (e.g. Water leakage in Block A)" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        <textarea required rows={4} placeholder="Describe the problem in detail" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        <div className="grid grid-cols-2 gap-4">
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2">
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2">
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="w-full text-sm" />
        <button disabled={submitting} className="w-full bg-brand-600 text-white rounded-lg py-2.5 font-medium hover:bg-brand-700 disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}
