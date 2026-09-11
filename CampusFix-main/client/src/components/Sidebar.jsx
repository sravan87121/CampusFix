import { NavLink } from 'react-router-dom';

const LINKS = {
  USER: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/tickets/new', label: 'Report an Issue' },
    { to: '/tickets/my', label: 'My Tickets' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/tickets', label: 'All Tickets' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/users', label: 'Users & Staff' },
  ],
  STAFF: [
    { to: '/staff', label: 'Dashboard' },
    { to: '/staff/tickets', label: 'Assigned Tickets' },
  ],
};

export default function Sidebar({ role }) {
  const links = LINKS[role] || LINKS.USER;
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)] p-4">
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
