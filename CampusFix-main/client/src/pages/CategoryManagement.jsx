import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory } from '../services/categoryService';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const load = () => getCategories().then(setCategories);
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCategory({ name });
      setName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const toggleActive = async (cat) => {
    await updateCategory(cat._id, { isActive: !cat.isActive });
    load();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
      </form>
      <div className="bg-white border border-gray-200 rounded-xl divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex items-center justify-between p-3">
            <span className={c.isActive ? '' : 'text-gray-400 line-through'}>{c.name}</span>
            <button onClick={() => toggleActive(c)} className="text-xs px-2 py-1 rounded bg-gray-100">
              {c.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
