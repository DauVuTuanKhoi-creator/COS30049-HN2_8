import { CheckCircle2, TerminalSquare, Shield, Rocket } from 'lucide-react';

const backendSetup = [
  'cd backend/webapp',
  'python -m venv venv',
  'venv\\Scripts\\activate',
  'pip install -r requirements.txt',
  'uvicorn main:app --reload --port 8000',
] as const;

const frontendSetup = [
  'cd frontend',
  'npm install',
  'npm run dev',
] as const;

const firstScanFlow = [
  {
    title: 'Create an account',
    detail: 'Call POST /api/auth/signup with name, email, and password.',
  },
  {
    title: 'Sign in and store your token',
    detail: 'Call POST /api/auth/signin and copy access_token for subsequent requests.',
  },
  {
    title: 'Run your first text scan',
    detail: 'Call POST /api/detect/text with a Bearer token and a text payload.',
  },
  {
    title: 'Review scan history',
    detail: 'Call GET /api/scans/history to confirm the result was saved.',
  },
] as const;

export default function GettingStarted() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Docs</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Getting Started</h1>
          <p className="max-w-3xl text-slate-600 dark:text-[#8b93c0]">
            Setup instructions, environment configuration, and a first scan walkthrough to get SecureGuard running locally.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <TerminalSquare className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Backend API: http://localhost:8000</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <Shield className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Auth: Bearer JWT token</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <Rocket className="mb-2 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Frontend dev server: http://localhost:5173</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
          <h2 className="mb-4 text-xl font-semibold">1. Backend Setup</h2>
          <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            {backendSetup.map((command) => (
              <div key={command} className="font-mono leading-7">
                {command}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-[#8b93c0]">
            Keep this terminal running while testing detection endpoints.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
          <h2 className="mb-4 text-xl font-semibold">2. Environment Configuration</h2>
          <p className="mb-3 text-sm text-slate-600 dark:text-[#8b93c0]">
            Create frontend/.env with the backend URL:
          </p>
          <div className="rounded-xl bg-slate-900 p-4 font-mono text-sm text-slate-100">VITE_API_URL=http://localhost:8000</div>
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            {frontendSetup.map((command) => (
              <div key={command} className="font-mono leading-7">
                {command}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
          <h2 className="mb-4 text-xl font-semibold">3. First Scan Walkthrough</h2>
          <div className="mb-5 space-y-3">
            {firstScanFlow.map((step) => (
              <div key={step.title} className="flex gap-3 rounded-xl border border-slate-200 p-3 dark:border-[#637aff]/15">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-600 dark:text-[#6a7fff]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.title}</p>
                  <p className="text-sm text-slate-600 dark:text-[#8b93c0]">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
            <div className="mb-2 font-semibold">Example request (text scan)</div>
            <div className="font-mono leading-7">curl -X POST "http://localhost:8000/api/detect/text" \</div>
            <div className="font-mono leading-7">  -H "Authorization: Bearer YOUR_TOKEN" \</div>
            <div className="font-mono leading-7">  -H "Content-Type: application/json" \</div>
            <div className="font-mono leading-7">{`  -d '{"text":"Congratulations! You won a free prize!"}'`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
