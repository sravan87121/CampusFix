import { useEffect, useState } from 'react';
import { getNotifications, markRead, markAllRead } from '../services/notificationService';

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = () => getNotifications().then((d) => setItems(d.notifications));
  useEffect(load, []);

  const handleRead = async (id) => { await markRead(id); load(); };
  const handleReadAll = async () => { await markAllRead(); load(); };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={handleReadAll} className="text-sm text-brand-600 font-medium">Mark all as read</button>
      </div>
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n._id} onClick={() => handleRead(n._id)}
            className={`p-4 rounded-lg border cursor-pointer ${n.isRead ? 'bg-white border-gray-200' : 'bg-brand-50 border-brand-200'}`}>
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-sm text-gray-600">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400">No notifications.</p>}
      </div>
    </div>
  );
}
