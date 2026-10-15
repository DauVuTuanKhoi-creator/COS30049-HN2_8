import { Braces, Globe, KeyRound } from 'lucide-react';

const endpointGroups = [
  {
    title: 'Authentication',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/signup',
        description: 'Create a new user and receive an access token.',
        authRequired: false,
      },
      {
        method: 'POST',
        path: '/api/auth/signin',
        description: 'Sign in with email and password to get a bearer token.',
        authRequired: false,
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Return profile information for the current authenticated user.',
        authRequired: true,
      },
    ],
  },
  {
    title: 'Detection',
    endpoints: [
      {
        method: 'POST',
        path: '/api/detect/text',
        description: 'Analyze text content for spam and malware indicators.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/detect/file',
        description: 'Analyze file metadata such as name, size, and MIME type.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/detect/file/upload',
        description: 'Upload a file and run content-aware malware detection.',
        authRequired: true,
      },
    ],
  },
  {
    title: 'Scans and Health',
    endpoints: [
      {
        method: 'GET',
        path: '/api/scans/history',
        description: 'Get recent scans for the authenticated user (most recent first).',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/health',
        description: 'Service health endpoint for uptime and readiness checks.',
        authRequired: false,
      },
    ],
  },
] as const;

export default function ApiReference() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Resources</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">API Reference</h1>
          <p className="max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Integrate SecureGuard with your applications using complete endpoint coverage and practical request examples.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <KeyRound className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Auth: Bearer token</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <Globe className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Base URL: http://localhost:8000</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <Braces className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Response format: JSON</p>
          </div>
        </div>

        <div className="space-y-6">
          {endpointGroups.map((group) => (
            <section key={group.title} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#637aff]/15">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 dark:border-[#637aff]/15 dark:bg-[#0f1220] dark:text-[#d8defe]">
                {group.title}
              </div>
              {group.endpoints.map((endpoint, index) => (
                <div
                  key={endpoint.path}
                  className={`flex flex-col gap-2 bg-white p-5 dark:bg-[#10131f] sm:flex-row sm:items-center sm:justify-between ${
                    index < group.endpoints.length - 1 ? 'border-b border-slate-200 dark:border-[#637aff]/15' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-[#6a7fff]/15 dark:text-[#9cabff]">
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-slate-900 dark:text-white">{endpoint.path}</code>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-[#1d2238] dark:text-[#aeb8e8]">
                        {endpoint.authRequired ? 'Auth required' : 'Public'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-[#8b93c0]">{endpoint.description}</p>
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
          <h2 className="mb-4 text-xl font-semibold">Example Requests</h2>

          <div className="mb-4 rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            <div className="mb-2 font-semibold">Sign in</div>
            <div className="font-mono leading-7">curl -X POST "http://localhost:8000/api/auth/signin" \\</div>
            <div className="font-mono leading-7">  -H "Content-Type: application/json" \\</div>
            <div className="font-mono leading-7">{`  -d '{"email":"analyst@secureguard.dev","password":"your-password"}'`}</div>
          </div>

          <div className="mb-4 rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            <div className="mb-2 font-semibold">Detect text</div>
            <div className="font-mono leading-7">curl -X POST "http://localhost:8000/api/detect/text" \\</div>
            <div className="font-mono leading-7">  -H "Authorization: Bearer YOUR_TOKEN" \\</div>
            <div className="font-mono leading-7">  -H "Content-Type: application/json" \\</div>
            <div className="font-mono leading-7">{`  -d '{"text":"Urgent! Claim your free prize now!"}'`}</div>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            <div className="mb-2 font-semibold">Scan history</div>
            <div className="font-mono leading-7">curl -X GET "http://localhost:8000/api/scans/history" \\</div>
            <div className="font-mono leading-7">  -H "Authorization: Bearer YOUR_TOKEN"</div>
          </div>
        </section>
      </div>
    </div>
  );
}
