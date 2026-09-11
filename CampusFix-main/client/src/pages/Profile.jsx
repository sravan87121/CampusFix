import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-md bg-white border border-gray-200 rounded-xl p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <dl className="space-y-2 text-sm">
        <div><dt className="text-gray-500 inline">Name: </dt><dd className="inline font-medium">{user.name}</dd></div>
        <div><dt className="text-gray-500 inline">Email: </dt><dd className="inline font-medium">{user.email}</dd></div>
        <div><dt className="text-gray-500 inline">Role: </dt><dd className="inline font-medium">{user.role}</dd></div>
        <div><dt className="text-gray-500 inline">Department: </dt><dd className="inline font-medium">{user.department || '—'}</dd></div>
        <div><dt className="text-gray-500 inline">Phone: </dt><dd className="inline font-medium">{user.phone || '—'}</dd></div>
      </dl>
    </div>
  );
}
