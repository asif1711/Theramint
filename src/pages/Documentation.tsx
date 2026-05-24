import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Lock, 
  Server, 
  Shield, 
  Zap,
  ArrowRight,
  Heart,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  CalendarDays,
  FileText,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DocSection = 'overview' | 'security' | 'booking' | 'clinical' | 'admin';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');

  const docTabs = [
    { id: 'overview' as DocSection, title: 'Platform Overview', icon: Layers },
    { id: 'security' as DocSection, title: 'Security & Identity', icon: Shield },
    { id: 'booking' as DocSection, title: 'Booking Lifecycle', icon: CalendarDays },
    { id: 'clinical' as DocSection, title: 'Clinical Documentation', icon: FileText },
    { id: 'admin' as DocSection, title: 'Administrative Reporting', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-sage-50 pb-32">
      {/* Immersive Doc Header */}
      <section className="pt-28 pb-16 px-4 overflow-hidden relative">
        <div className="container mx-auto relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-mint-200/50">
               <Terminal className="h-3.5 w-3.5" />
               <span>Version 1.0.0 • Technical Compendium</span>
            </div>
            <h1 className="serif text-5xl md:text-7xl font-bold text-sage-900 mb-6 tracking-wide leading-tight">
              Engineering <span className="text-mint-600">Empathetic Care.</span>
            </h1>
            <p className="text-base md:text-lg text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto opacity-85">
              The foundational specifications of Theramint's highly secure, fully integrated digital mental healthcare ecosystem.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-mint-100/20 to-transparent pointer-events-none -z-10" />
      </section>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Interactive Navigation Sidebar */}
          <div className="lg:col-span-4 sticky top-28 h-fit space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-100">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 pl-3 border-l-2 border-mint-500">
                Core Compartments
              </h4>
              <div className="space-y-1.5">
                {docTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive 
                        ? 'bg-mint-600 text-white shadow-lg shadow-mint-600/10' 
                        : 'text-zinc-500 hover:bg-mint-50 hover:text-sage-900'
                      }`}
                    >
                      <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-sage-900 text-white p-6 rounded-3xl relative overflow-hidden group">
              <h4 className="text-xs font-bold text-mint-400 uppercase tracking-widest mb-2">Technical Status</h4>
              <p className="text-[11px] text-mint-100/60 leading-relaxed mb-4">
                Theramint incorporates standard JWT challenge validation, email signup tokenization, and multi-user role parameters.
              </p>
              <div className="flex items-center gap-2 text-white">
                <Database className="h-4 w-4 text-mint-400" />
                <span className="font-mono text-xs text-mint-300">Prisma Client • Connected</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-mint-500/10 rounded-full blur-[30px]" />
            </div>
          </div>

          {/* Main Doc Content Window */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 hover:shadow-xl hover:shadow-zinc-900/5 transition-all"
              >
                {activeSection === 'overview' && (
                  <div className="space-y-8">
                    <div className="border-b border-zinc-100 pb-6">
                      <h2 className="serif text-3xl font-bold text-sage-900">Platform Overview</h2>
                      <p className="text-sm text-zinc-500 mt-2">Core tech stack, structural patterns, and user entry pathways.</p>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Theramint combines modern architectural principles with sensitive digital design to build a responsive virtual healthcare solution for private clients and mental health practitioners.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <h4 className="font-bold text-sage-900 text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4.5 w-4.5 text-mint-600" /> Frontend Core
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Builds on React 19 and Vite. Utilizes Tailwind CSS for highly accessible typography, optimal spacing ratios, and responsive mobile adaptation. Supports interactive routing parameters.
                        </p>
                      </div>

                      <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <h4 className="font-bold text-sage-900 text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4.5 w-4.5 text-mint-600" /> Server Architecture
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Express application executing secure router endpoints. Coordinates all patient profile requests, calendared interaction flows, support tickets, and role configurations of state databases.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-mint-50/50 rounded-2xl border border-mint-100/50">
                      <h4 className="font-bold text-sage-900 text-xs uppercase tracking-wider mb-3">Live System Stack</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="bg-white p-3 rounded-xl border border-mint-100/30">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">View Engine</p>
                          <p className="text-xs font-extrabold text-mint-800 mt-1">React 19</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-mint-100/30">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Bundler</p>
                          <p className="text-xs font-extrabold text-mint-800 mt-1">Vite 6</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-mint-100/30">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">Database Layer</p>
                          <p className="text-xs font-extrabold text-mint-800 mt-1">Prisma</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-mint-100/30">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">UI Framework</p>
                          <p className="text-xs font-extrabold text-mint-800 mt-1">Tailwind CSS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'security' && (
                  <div className="space-y-8">
                    <div className="border-b border-zinc-100 pb-6">
                      <h2 className="serif text-3xl font-bold text-sage-900">Security & Identity</h2>
                      <p className="text-sm text-zinc-500 mt-2">MFA challenge schemes, user states, password hashes, and middleware protection blocks.</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-sage-900 text-base">Stateful Role Privileged Model</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Every resource request queries server-side checks ensuring proper security isolation. Theramint enforces strict role stratification:
                      </p>
                      <div className="p-4 bg-zinc-50 rounded-xl space-y-2.5 font-mono text-xs text-zinc-700">
                        <div className="flex justify-between border-b border-zinc-200/50 pb-1.5">
                          <span className="font-bold text-sage-800">ROLE_CLIENT</span>
                          <span>Create bookings, view own invoices, contact helpdesk</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-200/50 pb-1.5">
                          <span className="font-bold text-mint-700">ROLE_THERAPIST</span>
                          <span>Complete patient records, check scheduled queue, consult analytics</span>
                        </div>
                        <div className="flex justify-between pb-0.5">
                          <span className="font-bold text-amber-700">ROLE_ADMIN</span>
                          <span>Provision systems, suspend accounts, download comprehensive records</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <h4 className="font-bold text-sage-900 text-sm mb-3">Two-Factor Authentication (2FA) Flow</h4>
                      <ol className="text-xs text-zinc-500 space-y-2 list-decimal pl-4 leading-relaxed">
                        <li>Candidate user requests authentication by sending regular username / password credentials.</li>
                        <li>Platform validates password integrity against the stored <code>passwordHash</code> via BCrypt.</li>
                        <li>If validated, the platform generates a randomized temporary 6-digit <code>twoFactorCode</code> and stores it with expiration.</li>
                        <li>The system emails the security coordinates; user is locked in an interactive 2FA challenge screen in the frontend.</li>
                        <li>Input verification of the code processes on the server, issuing valid session cookies once correct.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {activeSection === 'booking' && (
                  <div className="space-y-8">
                    <div className="border-b border-zinc-100 pb-6">
                      <h2 className="serif text-3xl font-bold text-sage-900">Booking Lifecycle</h2>
                      <p className="text-sm text-zinc-500 mt-2">Understanding scheduled states, session configurations, and invoice verification.</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        Appointments connect Patients with clinical Therapists in strict logical progressions:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <span className="text-[10px] font-bold text-amber-700 uppercase">1. PENDING</span>
                          <p className="text-[11px] text-zinc-500 mt-1">Client locks time slot</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">2. CONFIRMED</span>
                          <p className="text-[11px] text-zinc-500 mt-1">Therapist approves session</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                          <span className="text-[10px] font-bold text-blue-700 uppercase">3. COMPLETED</span>
                          <p className="text-[11px] text-zinc-500 mt-1">Session notes validated</p>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">CANCELLED</span>
                          <p className="text-[11px] text-zinc-500 mt-1">Slot returned online</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <h4 className="font-bold text-sage-900 text-sm">Key Architectural Parameters</h4>
                      <ul className="space-y-3.5 pl-4 list-disc text-sm text-zinc-600">
                        <li>
                          <strong>Session Types</strong>: Formatted either as <code>ONLINE</code> (rendering a secure video tele-health lobby link) or <code>IN_PERSON</code> clinical sessions.
                        </li>
                        <li>
                          <strong>Billing Tracing</strong>: Leverages <code>paymentStatus</code> field mapping status values across <code>UNPAID</code>, <code>PAID</code>, and <code>REFUNDED</code>. Therapists can configure payment collection to update these coordinates.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 'clinical' && (
                  <div className="space-y-8">
                    <div className="border-b border-zinc-100 pb-6">
                      <h2 className="serif text-3xl font-bold text-sage-900">Clinical Documentation</h2>
                      <p className="text-sm text-zinc-500 mt-2">Practitioner diagnostic logging, session summaries, and private notes.</p>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed">
                      To preserve high standards of medical audit records and structured historical diagnostics, Theramint maintains a segregated clinical tracking model. Session details are logged directly into <code>SessionRecord</code> schemas under specific therapist ownership validation.
                    </p>

                    <div className="p-6 bg-zinc-900 rounded-2xl relative">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                        <span className="text-[10px] font-bold text-mint-400 font-mono">POST /api/session-records</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">Therapist Required</span>
                      </div>
                      <pre className="text-[11px] text-white font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`{
  "appointmentId": "clx_appointment_7894",
  "summary": "Explored primary workplace stress triggers.",
  "therapistNotes": "Patient exhibiting clinical cognitive traps. Recommended mindfulness pacing.",
  "followUpDate": "2026-06-15T00:00:00.000Z",
  "remarks": "Assigned CBT Worksheet 4."
}`}
                      </pre>
                    </div>

                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs text-zinc-500 leading-relaxed space-y-2">
                      <p className="font-bold text-sage-900">Privacy Partition Principles:</p>
                      <p>• <strong>Client Summary</strong>: Client accesses high-level action steps and follow-up directives on their dashboard.</p>
                      <p>• <strong>Therapist Notes</strong>: Raw behavioral evaluations, mental diagnostic summaries, and clinician formulations are scrubbed from general client response payloads for absolute ethical containment.</p>
                    </div>
                  </div>
                )}

                {activeSection === 'admin' && (
                  <div className="space-y-8">
                    <div className="border-b border-zinc-100 pb-6">
                      <h2 className="serif text-3xl font-bold text-sage-900">Administrative Reporting</h2>
                      <p className="text-sm text-zinc-500 mt-2">Master database translation, CSV compilation pipeline, and safety boundaries.</p>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Theramint provides administrators with real-time auditing dashboards. For deep reviews, clicking the <strong>Generate Report</strong> button triggers a heavy-duty backend query aggregating live statistics.
                    </p>

                    <div className="p-5 bg-mint-50/50 rounded-2xl border border-mint-100/50 space-y-3.5">
                      <h4 className="font-bold text-sage-900 text-sm flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-mint-700" /> Dynamic CSV Auditing Engine
                      </h4>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Rather than storing stale reports on the server, the endpoint <code>GET /api/admin/report/csv</code> queries five database tables on the fly. It constructs a secure byte stream on Express, sanitizes comma separations and quotes to prevent CSV injection vulnerabilities, and prompts a clean file download.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Report Structure Output Sections</p>
                      <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono font-bold">
                        <div className="p-3 bg-zinc-50 rounded-lg text-sage-900">1. SYSTEM METRICS MASTER SUMMARY</div>
                        <div className="p-3 bg-zinc-50 rounded-lg text-sage-900">2. COMPREHENSIVE USER ACCOUNTS</div>
                        <div className="p-3 bg-zinc-50 rounded-lg text-sage-900">3. PRACTITIONER REGISTRY</div>
                        <div className="p-3 bg-zinc-50 rounded-lg text-sage-900">4. FULL APPOINTMENTS HISTORY</div>
                        <div className="p-3 bg-zinc-50 rounded-lg text-sage-900 col-span-2">5. ACTIVE SUPPORT TICKETS</div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
