import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white">Full-Stack Electron Architecture</h1>
          <p className="text-blue-100 mt-2">React 19 (Next.js) + Express + MySQL + Electron</p>
        </div>
        
        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Project Structure</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{`
project-root/
├── electron/          # Desktop wrapper
├── backend/           # Express + MySQL API (Port 3001)
│   ├── src/
│   │   ├── config/    # DB Connection
│   │   ├── routes/    # API Routes
│   │   └── server.ts  # Entry point
└── frontend/          # Next.js App Router (Port 3000)
    ├── src/
    │   ├── app/       # Pages & Layouts
    │   ├── lib/       # API Client
    │   └── context/   # Auth State
              `}</pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Quick Start Guide</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Database:</strong> Ensure MySQL is running and import <code className="bg-gray-100 px-1 py-0.5 rounded">backend/database/schema.sql</code>.</li>
              <li><strong>Environment:</strong> Configure <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> files in both frontend and backend folders.</li>
              <li><strong>Backend:</strong> Run <code className="text-blue-600">cd backend && npm install && npm run dev</code>.</li>
              <li><strong>Frontend:</strong> Run <code className="text-blue-600">cd frontend && npm install && npm run dev</code>.</li>
              <li><strong>Electron:</strong> Run <code className="text-blue-600">npm run electron:dev</code> in the root.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;