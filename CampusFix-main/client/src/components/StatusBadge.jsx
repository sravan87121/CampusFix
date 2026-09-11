import { STATUS_COLORS } from '../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || ''}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
