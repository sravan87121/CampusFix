import { useState } from 'react';

export default function CommentBox({ comments, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="font-semibold">{c.user?.name} · {c.user?.role}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-800">{c.message}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet.</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
          Send
        </button>
      </form>
    </div>
  );
}
