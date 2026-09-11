import { useEffect, useState } from 'react';
import { getUsers, changeUserRole, toggleUserActive } from '../services/userService';

export default function StaffManagement() {
  const [users, setUsers] = useState([]);

  const load = () => getUsers().then(setUsers);
  useEffect(load, []);

  const handleRoleChange = async (id, role) => { await changeUserRole(id, role); load(); };
  const handleToggle = async (u) => { await toggleUserActive(u._id, !u.isActive); load(); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User & Staff Management</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select defaultValue={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border border-gray-200 rounded px-1 py-0.5 text-xs">
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => handleToggle(u)} className="text-xs px-2 py-1 rounded bg-gray-100">
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
