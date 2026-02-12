import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <main className="mx-auto max-w-lg p-6">
    <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
    <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
    <Link className="mt-4 inline-block text-brand-700 underline" to="/inventory">
      Go back to inventory
    </Link>
  </main>
);
