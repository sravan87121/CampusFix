import { Link } from 'react-router-dom';

const FEATURES = [
  { title: 'Report in seconds', desc: 'Submit a ticket with photos, location, and category in under a minute.' },
  { title: 'Track every repair', desc: 'Live status from Open to Closed, with a full history of every change.' },
  { title: 'Smart prioritization', desc: 'Urgent hazards get flagged and routed to staff immediately.' },
  { title: 'Real dashboards', desc: 'Admins see workload, resolution time, and category trends at a glance.' },
];

const CATEGORIES = ['Electrical', 'Plumbing', 'Air Conditioning', 'Furniture', 'Internet', 'Cleaning', 'Classroom', 'Laboratory', 'Security', 'Infrastructure'];

export default function Landing() {
  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">CampusFix</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
          Report campus problems. Track every repair. Keep your campus running.
        </p>
        <p className="text-brand-600 font-medium mb-8">Report. Track. Resolve.</p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
            Report an Issue
          </Link>
          <Link to="/login" className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
            Track My Ticket
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          {['Report the issue', 'Admin reviews & assigns', 'Staff resolves it', 'You get notified'].map((step, i) => (
            <div key={step} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto mb-3 font-semibold">
                {i + 1}
              </div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Maintenance Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c) => (
            <span key={c} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
              {c}
            </span>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        © {new Date().getFullYear()} CampusFix — Campus Maintenance Ticket Management System
      </footer>
    </div>
  );
}
