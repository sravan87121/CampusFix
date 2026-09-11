export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
