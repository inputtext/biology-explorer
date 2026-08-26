import { Link, useLocation } from 'react-router-dom';
import bioData from '../data/biologyData.json';

export default function Breadcrumbs() {
  const location = useLocation();

  const parts = location.pathname.split('/').filter(Boolean);

  // Dashboard has no breadcrumb trail.
  if (parts.length === 0) {
    return null;
  }

  // Find the actual hub from biologyData.
  const hub =
    parts[0] === 'hub'
      ? bioData.hubs.find((item) => item.id === parts[1])
      : null;

  const formatLabel = (value) => {
    return value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold"
    >
      {/* Home */}
      <Link
        to="/"
        className="text-slate-500 transition-opacity hover:opacity-60 dark:text-slate-400"
      >
        Home
      </Link>

      {/* Separator */}
      <span
        aria-hidden="true"
        className="text-slate-300 dark:text-slate-600"
      >
        /
      </span>

      {/* Hub */}
      {parts[0] === 'hub' && (
        <>
          {parts.length === 2 ? (
            <span className="text-slate-900 dark:text-slate-100">
              {hub?.title || 'Learning Hub'}
            </span>
          ) : (
            <Link
              to={`/hub/${parts[1]}`}
              className="text-slate-500 transition-opacity hover:opacity-60 dark:text-slate-400"
            >
              {hub?.title || 'Learning Hub'}
            </Link>
          )}
        </>
      )}

      {/* Future route segments */}
      {parts.slice(2).map((part, index) => {
        const actualIndex = index + 2;
        const isLast = actualIndex === parts.length - 1;

        const path = `/${parts
          .slice(0, actualIndex + 1)
          .join('/')}`;

        const label = formatLabel(part);

        return (
          <span
            key={`${part}-${actualIndex}`}
            className="flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className="text-slate-300 dark:text-slate-600"
            >
              /
            </span>

            {isLast ? (
              <span className="text-slate-900 dark:text-slate-100">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-slate-500 transition-opacity hover:opacity-60 dark:text-slate-400"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
