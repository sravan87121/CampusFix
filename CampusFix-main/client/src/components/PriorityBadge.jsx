import { PRIORITY_COLORS } from '../utils/constants';

export default function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[priority] || ''}`}>
      {priority}
    </span>
  );
}
