import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpDown,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CircleX,
  ClipboardList,
  Clock3,
  Eye,
  FlaskConical,
  Gauge,
  Globe2,
  HelpCircle,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Target,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import './App.css'

type View = 'submissions' | 'insights' | 'scoring' | 'users' | 'settings'
type SubmissionStatus =
  | 'In Admin Review'
  | 'On Hold'
  | 'Awaiting Decision'
  | 'AI Scoring'
  | 'Shortlisted'
  | 'Handed Off'
  | 'Submitted'
  | 'Closed'

type Submission = {
  id: number
  name: string
  company: string
  status: SubmissionStatus
  score: number | null
  tier: string | null
  groups: string[]
  region: string
  date: string
  owner: string
  summary: string
  nextStep: string
}

type User = {
  initials: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Reviewer' | 'Viewer'
  status: 'Active' | 'Inactive'
  lastLogin: string
}

const navItems = [
  { id: 'submissions', label: 'Submissions', icon: ClipboardList },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'scoring', label: 'Scoring Guide', icon: BookOpen },
  { id: 'users', label: 'Users', icon: Users },
] satisfies { id: View; label: string; icon: typeof ClipboardList }[]

const submissions: Submission[] = [
  {
    id: 1,
    name: 'GreenShield Surfactant Platform',
    company: 'GreenShield Bio B.V.',
    status: 'In Admin Review',
    score: 8.9,
    tier: 'Tier 1',
    groups: ['Home Care', 'Personal Care'],
    region: 'Europe',
    date: 'Apr 7, 2026',
    owner: 'Gurnoor Kahlon',
    summary:
      'Bio-based surfactant chemistry with strong category relevance, defensible process IP, and near-term pathway for Home Care formulation testing.',
    nextStep: 'Escalate to category leadership and open technical diligence within 48 hours.',
  },
  {
    id: 2,
    name: 'Fermento Base',
    company: 'Fermento Base GmbH',
    status: 'On Hold',
    score: 7.8,
    tier: 'Tier 2',
    groups: ['Foods'],
    region: 'Europe',
    date: 'Apr 9, 2026',
    owner: 'Sarah Chen',
    summary:
      'Precision fermentation input with promising unit economics and early customer pilots in adjacent food applications.',
    nextStep: 'Request clearer exclusivity position and updated capacity timeline.',
  },
  {
    id: 3,
    name: 'SkinAI Diagnostic Platform',
    company: 'SkinAI Labs Inc.',
    status: 'On Hold',
    score: 5.3,
    tier: 'Tier 3',
    groups: ['Beauty & Wellbeing', 'Digital R&D'],
    region: 'North America',
    date: 'Mar 28, 2026',
    owner: 'Marcus Webb',
    summary:
      'AI-enabled skin assessment platform with interesting engagement data, but a complex regulatory and claims pathway.',
    nextStep: 'Clarify consumer claims strategy and data privacy posture.',
  },
  {
    id: 4,
    name: 'BioSynth Enzyme Complex',
    company: 'EnzyTech AG',
    status: 'Awaiting Decision',
    score: 7.2,
    tier: 'Tier 2',
    groups: ['Foods', 'Home Care'],
    region: 'Europe',
    date: 'Mar 15, 2026',
    owner: 'James OBrien',
    summary:
      'Enzyme platform with cross-category application potential and evidence from commercial ingredient partnerships.',
    nextStep: 'Confirm preferred use case and assign technical reviewer.',
  },
  {
    id: 5,
    name: 'PlasticAlt Packaging Solution',
    company: 'GreenPack Corp.',
    status: 'AI Scoring',
    score: 6.1,
    tier: 'Tier 3',
    groups: ['Home Care'],
    region: 'North America',
    date: 'Apr 12, 2026',
    owner: 'AI Review',
    summary:
      'Compostable packaging substrate with improving performance but incomplete manufacturing evidence.',
    nextStep: 'Complete AI evidence extraction and check claims against current packaging requirements.',
  },
  {
    id: 6,
    name: 'NutriBoost Probiotic Blend',
    company: 'VitalFlora Ltd.',
    status: 'Shortlisted',
    score: 8.4,
    tier: 'Tier 1',
    groups: ['Foods', 'Beauty & Wellbeing'],
    region: 'Asia Pacific',
    date: 'Feb 28, 2026',
    owner: 'Sarah Chen',
    summary:
      'Clinically supported probiotic blend with partner-ready materials and strong overlap with nutrition priorities.',
    nextStep: 'Schedule discovery call with Foods and Beauty & Wellbeing stakeholders.',
  },
  {
    id: 7,
    name: 'SmartClean IoT Platform',
    company: 'CleanTech Systems Inc.',
    status: 'Handed Off',
    score: 7.9,
    tier: 'Tier 2',
    groups: ['Home Care', 'Digital R&D'],
    region: 'North America',
    date: 'Mar 5, 2026',
    owner: 'James OBrien',
    summary:
      'Connected cleaning insights platform with mature pilots and direct relevance for usage analytics.',
    nextStep: 'Follow partner handoff and capture diligence notes in the category workspace.',
  },
  {
    id: 8,
    name: 'DermaPeptide Complex',
    company: 'BioLab Singapore',
    status: 'Submitted',
    score: null,
    tier: null,
    groups: ['Beauty & Wellbeing', 'Personal Care'],
    region: 'Asia Pacific',
    date: 'Jul 10, 2026',
    owner: 'Unassigned',
    summary:
      'Peptide ingredient submission awaiting source validation and first-pass disqualifier screening.',
    nextStep: 'Run hard-filter checks and route to Beauty & Wellbeing intake owner.',
  },
  {
    id: 9,
    name: 'ColdChain Natural Preservatives',
    company: 'Nordic Fresh AB',
    status: 'Closed',
    score: 4.9,
    tier: 'Tier 4',
    groups: ['Foods'],
    region: 'Europe',
    date: 'Jan 18, 2026',
    owner: 'PJ Mistry',
    summary:
      'Preservation claims were compelling, but evidence did not support a scalable consumer product pathway.',
    nextStep: 'No active action. Keep company tagged for future evidence refresh.',
  },
  {
    id: 10,
    name: 'AquaSense Refill Station',
    company: 'LoopWorks Labs',
    status: 'Closed',
    score: 6.6,
    tier: 'Tier 2',
    groups: ['Home Care', 'Personal Care'],
    region: 'North America',
    date: 'Dec 11, 2025',
    owner: 'Hebe Zuo',
    summary:
      'Interesting refill hardware concept, closed because of exclusivity constraints in priority markets.',
    nextStep: 'Archive diligence notes and flag exclusivity if partner status changes.',
  },
]

const users: User[] = [
  {
    initials: 'GK',
    name: 'Gurnoor Kahlon',
    email: 'gurnoor.kahlon@unilever.com',
    role: 'Owner',
    status: 'Active',
    lastLogin: '7/13/2026, 3:36:51 PM',
  },
  {
    initials: 'HZ',
    name: 'Hebe Zuo',
    email: 'hebe.zuo2@unilever.com',
    role: 'Owner',
    status: 'Active',
    lastLogin: 'Never',
  },
  {
    initials: 'PM',
    name: 'PJ Mistry',
    email: 'pj.mistry@unilever.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Never',
  },
  {
    initials: 'JM',
    name: 'Joshua Mathew',
    email: 'joshua.mathew@unilever.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '6/29/2026, 7:54:54 AM',
  },
  {
    initials: 'AT',
    name: 'Amit Tawani',
    email: 'amit.tawani@unilever.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Never',
  },
  {
    initials: 'CE',
    name: 'Chris Evans',
    email: 'chris.evans@unilever.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Never',
  },
  {
    initials: 'MO',
    name: 'Milad Olad',
    email: 'milad.olad@unilever.com',
    role: 'Owner',
    status: 'Active',
    lastLogin: '7/9/2026, 7:42:00 PM',
  },
  {
    initials: 'LL',
    name: 'Lucy Liu',
    email: 'lucy.liu2@unilever.com',
    role: 'Owner',
    status: 'Active',
    lastLogin: 'Never',
  },
  {
    initials: 'DR',
    name: 'Demo Reviewer',
    email: 'demo.reviewer@unilever.com',
    role: 'Reviewer',
    status: 'Active',
    lastLogin: 'Never',
  },
]

const scoreComponents = [
  {
    id: 'C1',
    title: 'Unilever Category Fit',
    points: 2.5,
    color: '#6467f2',
    copy: 'How directly the solution fits Unilever categories, brands, and active innovation priorities.',
    evidence:
      'Company target markets, current customers, primary application, and Unilever innovation priorities.',
  },
  {
    id: 'C2',
    title: 'Solution Value & Defensibility',
    points: 2,
    color: '#3b82f6',
    copy: 'Differentiation, defensibility, scalability, and strategic value of the proposed solution.',
    evidence: 'Patent portfolio, application mapping, competitive landscape, and barriers to replication.',
  },
  {
    id: 'C3',
    title: 'Regulatory / Claims Pathway',
    points: 1.5,
    color: '#10b981',
    copy: 'Complexity and timeline of regulatory, claims, and market access pathway in key jurisdictions.',
    evidence: 'Regulatory classification, existing approvals, comparable precedents, and timeline estimates.',
  },
  {
    id: 'C4',
    title: 'Commercial Validation',
    points: 2,
    color: '#f59e0b',
    copy: 'Evidence of commercial traction and market validation with brand customers.',
    evidence: 'Published partnerships, products in market, revenue figures, and named pilot partners.',
  },
  {
    id: 'C5',
    title: 'Partnership Readiness',
    points: 1,
    color: '#ec4899',
    copy: 'Organizational capacity and willingness to engage in strategic partnership.',
    evidence: 'Team structure, response time, partnership materials, funding, and exclusivity posture.',
  },
  {
    id: 'C6',
    title: 'Company Stage & Resourcing Fit',
    points: 1,
    color: '#22c7dc',
    copy: "Alignment between company maturity, funding, team capacity, and Unilever's preferred partner profile.",
    evidence: 'Funding history, employee count, press releases, and investor composition.',
  },
]

const disqualifiers = [
  'Pharmaceutical / therapeutic focus',
  'Competitor acquisition or exclusivity',
  'Oncology, gene therapy, or cell therapy core',
  'No consumer product pathway within 7 years',
  'Legal or financial distress',
  'Prescription-only or Class III requirement',
  'Geographic rights unavailable',
  'Customer model mismatch',
]

const activityItems = [
  ['NutriBoost Probiotic Blend', 'Shortlisted by Sarah Chen', '2h ago'],
  ['GreenShield Surfactant Platform', 'Moved to Admin Review by Gurnoor Kahlon', '5h ago'],
  ['SkinAI Diagnostic Platform', 'Placed On Hold by Marcus Webb', '1d ago'],
  ['SmartClean IoT Platform', 'Handed Off by James OBrien', '2d ago'],
]

function App() {
  const [activeView, setActiveView] = useState<View>('submissions')
  const [search, setSearch] = useState('')
  const [timeRange, setTimeRange] = useState('All Time')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [compactNav, setCompactNav] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const openSubmissions = submissions.filter((item) => item.status !== 'Closed')
  const closedSubmissions = submissions.filter((item) => item.status === 'Closed')

  const filteredSubmissions = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return openSubmissions
    return openSubmissions.filter((item) =>
      [item.name, item.company, item.region, item.status, ...item.groups].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
  }, [openSubmissions, search])

  const title = {
    submissions: 'Submissions',
    insights: 'Insights',
    scoring: 'Scoring Guide',
    users: 'Users',
    settings: 'Settings',
  }[activeView]

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${compactNav ? 'is-open' : ''}`}>
        <button className="mobile-menu" type="button" onClick={() => setCompactNav(false)} aria-label="Close menu">
          <X size={18} />
        </button>
        <div className="brand-lockup">
          <span className="brand-mark">
            <FlaskConical size={18} />
          </span>
          <span>
            <strong>Unilever</strong>
            <small>R&D Portal</small>
          </span>
        </div>

        <div className="nav-block">
          <p>Admin</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeView === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                setActiveView(item.id)
                setCompactNav(false)
              }}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={activeView === 'settings' ? 'nav-item active settings-link' : 'nav-item settings-link'}
          onClick={() => {
            setActiveView('settings')
            setCompactNav(false)
          }}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </aside>

      <div className="mobile-scrim" hidden={!compactNav} onClick={() => setCompactNav(false)} />

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button className="icon-button nav-toggle" type="button" onClick={() => setCompactNav(true)} aria-label="Open menu">
              <Menu size={18} />
            </button>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              <Sun size={18} />
            </button>
            <div className="profile-chip">
              <span>GK</span>
              <strong>Gurnoor Kahlon</strong>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="content-surface">
          {activeView === 'submissions' && (
            <SubmissionsView
              closedSubmissions={closedSubmissions}
              filteredSubmissions={filteredSubmissions}
              search={search}
              setSearch={setSearch}
              setSelectedSubmission={setSelectedSubmission}
              setShowFilters={setShowFilters}
              setShowManual={setShowManual}
              setTimeRange={setTimeRange}
              timeRange={timeRange}
            />
          )}
          {activeView === 'insights' && <InsightsView timeRange={timeRange} setTimeRange={setTimeRange} />}
          {activeView === 'scoring' && <ScoringGuideView />}
          {activeView === 'users' && <UsersView setShowManual={setShowManual} />}
          {activeView === 'settings' && <SettingsView />}
        </section>
      </main>

      {showFilters && <FiltersPanel onClose={() => setShowFilters(false)} />}
      {showManual && <ManualSubmissionModal onClose={() => setShowManual(false)} />}
      {selectedSubmission && (
        <SubmissionDrawer submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
      )}
    </div>
  )
}

type SubmissionsViewProps = {
  closedSubmissions: Submission[]
  filteredSubmissions: Submission[]
  search: string
  setSearch: (value: string) => void
  setSelectedSubmission: (submission: Submission) => void
  setShowFilters: (value: boolean) => void
  setShowManual: (value: boolean) => void
  setTimeRange: (value: string) => void
  timeRange: string
}

function SubmissionsView({
  closedSubmissions,
  filteredSubmissions,
  search,
  setSearch,
  setSelectedSubmission,
  setShowFilters,
  setShowManual,
  setTimeRange,
  timeRange,
}: SubmissionsViewProps) {
  return (
    <div className="view-stack">
      <div className="view-heading split">
        <p>
          <strong>10</strong> total submissions
        </p>
        <div className="header-buttons">
          <button className="icon-button" type="button" aria-label="Help">
            <HelpCircle size={18} />
          </button>
          <button className="primary-button" type="button" onClick={() => setShowManual(true)}>
            <Plus size={18} />
            New Manual Submission
          </button>
        </div>
      </div>

      <div className="toolbar">
        <SegmentedControl
          value={timeRange}
          options={['7 Days', '30 Days', '90 Days', 'All Time', 'Custom']}
          onChange={setTimeRange}
        />
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or company..."
          />
        </label>
        <button className="soft-button" type="button">
          <ArrowUpDown size={16} />
          Sort: Date
        </button>
        <button className="soft-button" type="button" onClick={() => setShowFilters(true)}>
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <SectionLabel label="Open" count={filteredSubmissions.length} />
      <div className="submission-list">
        {filteredSubmissions.map((submission, index) => (
          <SubmissionCard
            key={submission.id}
            index={index}
            submission={submission}
            onSelect={() => setSelectedSubmission(submission)}
          />
        ))}
      </div>

      <button className="closed-row" type="button">
        <span>Closed</span>
        <strong>{closedSubmissions.length}</strong>
        <ChevronDown size={16} />
      </button>
    </div>
  )
}

function SubmissionCard({
  index,
  onSelect,
  submission,
}: {
  index: number
  onSelect: () => void
  submission: Submission
}) {
  return (
    <button
      className="submission-card"
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="submission-main">
        <div className="submission-title">
          <strong>{submission.name}</strong>
          <span>|</span>
          <small>{submission.company}</small>
        </div>
        <div className="chip-row">
          <StatusPill status={submission.status} />
          {submission.score ? (
            <span className="score-text">
              {submission.score}
              <small>/10</small>
            </span>
          ) : (
            <span className="score-empty">-</span>
          )}
          {submission.tier && <span className="tier-pill">{submission.tier}</span>}
          {submission.groups.map((group) => (
            <span key={group} className="category-pill">
              {group}
            </span>
          ))}
          <span className="region-chip">
            <MapPin size={13} />
            {submission.region}
          </span>
        </div>
      </div>
      <time>{submission.date}</time>
    </button>
  )
}

function StatusPill({ status }: { status: SubmissionStatus }) {
  const tone = {
    'In Admin Review': 'blue',
    'On Hold': 'orange',
    'Awaiting Decision': 'amber',
    'AI Scoring': 'purple',
    Shortlisted: 'green',
    'Handed Off': 'cyan',
    Submitted: 'slate',
    Closed: 'red',
  }[status]
  return (
    <span className={`status-pill ${tone}`}>
      <i />
      {status}
    </span>
  )
}

function SectionLabel({ count, label }: { count: number; label: string }) {
  return (
    <div className="section-label">
      <span>{label}</span>
      <strong>{count}</strong>
    </div>
  )
}

function InsightsView({
  setTimeRange,
  timeRange,
}: {
  setTimeRange: (value: string) => void
  timeRange: string
}) {
  return (
    <div className="view-stack">
      <SegmentedControl
        value={timeRange}
        options={['7 Days', '30 Days', '90 Days', 'All Time', 'Custom']}
        onChange={setTimeRange}
      />
      <div className="data-tabs">
        {[
          ['Overview', BarChart3],
          ['Geographies', Globe2],
          ['Business Groups', BriefcaseBusiness],
          ['Product Stages', Layers3],
          ['Lifecycle', Activity],
        ].map(([label, Icon]) => (
          <button key={label as string} className={label === 'Overview' ? 'active' : ''} type="button">
            <Icon size={15} />
            {label as string}
          </button>
        ))}
      </div>

      <div className="kpi-grid">
        <KpiCard label="Total Submissions" value="61" delta="+12% vs prev" icon={ClipboardList} tone="violet" />
        <KpiCard label="Active Reviews" value="18" delta="+3 vs prev" icon={Eye} tone="blue" />
        <KpiCard label="Avg. Score" value="6.8" delta="+0.4 vs prev" icon={Star} tone="amber" />
        <KpiCard label="Shortlist Rate" value="29%" delta="-2% vs prev" icon={Target} tone="green" negative />
        <KpiCard label="Days to Decision" value="24d" delta="-3d vs prev" icon={Clock3} tone="pink" />
        <KpiCard label="Closed (DQ)" value="3" delta="+1 vs prev" icon={CircleX} tone="red" negative />
      </div>

      <div className="analytics-grid">
        <ChartPanel className="wide" title="Submission Trend" subtitle="Monthly volume - last 12 months">
          <LineChart />
        </ChartPanel>
        <ChartPanel title="Decision Pipeline" subtitle="Current status distribution">
          <DonutChart />
        </ChartPanel>
        <ChartPanel title="Score Distribution" subtitle="Submissions grouped by score band">
          <BarChart />
        </ChartPanel>
        <ChartPanel title="Tier Breakdown" subtitle="Submissions by tier classification">
          <TierBars />
        </ChartPanel>
        <ChartPanel className="full" title="Recent Activity" subtitle="Latest decisions and status changes">
          <ActivityList />
        </ChartPanel>
      </div>
    </div>
  )
}

function KpiCard({
  delta,
  icon: Icon,
  label,
  negative,
  tone,
  value,
}: {
  delta: string
  icon: typeof ClipboardList
  label: string
  negative?: boolean
  tone: string
  value: string
}) {
  return (
    <article className="kpi-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={negative ? 'negative' : ''}>{delta}</small>
      </div>
      <em className={`metric-icon ${tone}`}>
        <Icon size={15} />
      </em>
    </article>
  )
}

function ChartPanel({
  children,
  className = '',
  subtitle,
  title,
}: {
  children: React.ReactNode
  className?: string
  subtitle: string
  title: string
}) {
  return (
    <article className={`chart-panel ${className}`}>
      <header>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </header>
      {children}
    </article>
  )
}

function LineChart() {
  return (
    <div className="line-chart">
      <div className="chart-legend">
        <span className="violet">Submissions</span>
        <span className="green">Shortlisted</span>
      </div>
      <svg viewBox="0 0 740 230" role="img" aria-label="Submission trend line chart">
        {[0, 1, 2, 3, 4].map((line) => (
          <line key={line} x1="38" x2="716" y1={28 + line * 42} y2={28 + line * 42} />
        ))}
        <path d="M38 181 C92 174 103 162 145 145 S229 152 267 178 S331 104 386 116 S440 77 492 88 S555 67 590 69 S639 133 716 154" />
        <path className="green-path" d="M38 206 C90 194 118 181 157 178 S220 190 270 190 S336 160 388 160 S441 184 493 168 S554 139 590 139 S643 184 716 191" />
        {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((label, index) => (
          <text key={label} x={38 + index * 61} y="221">
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="donut-layout">
      <div className="donut" />
      <div className="donut-key">
        {[
          ['Active', '18', 'violet'],
          ['On Hold', '8', 'orange'],
          ['Shortlisted', '18', 'green'],
          ['Closed', '10', 'red'],
        ].map(([label, value, color]) => (
          <span key={label}>
            <i className={color} />
            {label}
            <strong>{value}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

function BarChart() {
  const bars = [3, 5, 12, 18, 14, 6, 3]
  const labels = ['0-2', '2-4', '4-6', '6-7', '7-8', '8-9', '9-10']
  return (
    <div className="bar-chart">
      {bars.map((bar, index) => (
        <div key={labels[index]} className={`bar bar-${index + 1}`}>
          <span style={{ height: `${bar * 7}px` }} />
          <small>{labels[index]}</small>
        </div>
      ))}
    </div>
  )
}

function TierBars() {
  const tiers = [
    ['Tier 1', 20, 12],
    ['Tier 2', 30, 18],
    ['Tier 3', 26, 16],
    ['Tier 4', 15, 9],
    ['Tier 5', 10, 6],
  ]
  return (
    <div className="tier-bars">
      {tiers.map(([label, percent, value], index) => (
        <div key={label}>
          <p>
            <strong>{label}</strong>
            <span>
              {value} <small>({percent}%)</small>
            </span>
          </p>
          <em>
            <i className={`tier-color-${index + 1}`} style={{ width: `${percent}%` }} />
          </em>
        </div>
      ))}
    </div>
  )
}

function ActivityList() {
  return (
    <div className="activity-list">
      {activityItems.map(([title, copy, time]) => (
        <div key={title}>
          <span>
            <Sparkles size={16} />
          </span>
          <p>
            <strong>{title}</strong>
            <small>{copy}</small>
          </p>
          <time>{time}</time>
        </div>
      ))}
    </div>
  )
}

function ScoringGuideView() {
  return (
    <div className="view-stack scoring-view">
      <div className="framework-grid">
        <KpiCard label="Framework" value="v1" delta="active" icon={BookOpen} tone="violet" />
        <KpiCard label="Maximum UFS" value="10" delta="points" icon={Star} tone="blue" />
        <KpiCard label="Components" value="6" delta="scored dimensions" icon={Layers3} tone="green" />
        <KpiCard label="Disqualifiers" value="8" delta="hard filters" icon={CircleX} tone="red" />
      </div>

      <article className="flow-card">
        <p className="eyebrow">Scoring Flow</p>
        {[
          ['1', 'Hard filters first', 'The system checks disqualifiers before fit scoring and separates hard-filter matches from normal UFS scoring.'],
          ['2', 'Component scoring', 'Eligible submissions are scored across the active UFS components, each contributing to the configured maximum score.'],
          ['3', 'Tier and action', 'The final UFS score maps to a tier and recommended action while reviewers inspect evidence before decisions.'],
        ].map(([step, title, copy]) => (
          <div key={step}>
            <span>{step}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </div>
        ))}
      </article>

      <section>
        <div className="section-copy">
          <h2>Components</h2>
          <p>These are the scored dimensions used for eligible submissions.</p>
        </div>
        <article className="allocation-card">
          <p className="eyebrow">Score Allocation (Total: 10 pts)</p>
          <div className="allocation-bar">
            {scoreComponents.map((component) => (
              <i
                key={component.id}
                style={{
                  background: component.color,
                  width: `${component.points * 10}%`,
                }}
              />
            ))}
          </div>
          <div className="allocation-key">
            {scoreComponents.map((component) => (
              <span key={component.id}>
                <i style={{ background: component.color }} />
                {component.id} {component.title} - <strong>{component.points} pts</strong>
              </span>
            ))}
          </div>
        </article>
        <div className="component-grid">
          {scoreComponents.map((component) => (
            <article key={component.id} className="component-card">
              <span style={{ background: component.color }}>{component.id}</span>
              <div>
                <header>
                  <strong>{component.title}</strong>
                  <em>{component.points} pts</em>
                </header>
                <p>{component.copy}</p>
                <small>{component.evidence}</small>
              </div>
              <ChevronDown size={16} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-copy">
          <h2>Disqualifiers</h2>
          <p>Hard filters are checked before the weighted UFS score is used.</p>
        </div>
        <div className="dq-grid">
          {disqualifiers.map((item, index) => (
            <article key={item}>
              <span>DQ-{index + 1}</span>
              <strong>{item}</strong>
              <p>Requires reviewer confirmation and evidence capture before the submission can be closed.</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-copy">
          <h2>Tier Outcomes</h2>
          <p>Final UFS scores map to these review outcomes.</p>
        </div>
        <div className="tier-table">
          {[
            ['Tier 1', '8-10', 'Strategic Priority', 'Immediate outreach and category escalation', '48 hours'],
            ['Tier 2', '6.5-7.9', 'High Potential', 'Assign owner and develop partnership thesis', '2 weeks'],
            ['Tier 3', '5-6.4', 'Monitor', 'Request evidence and revisit after milestone', '30 days'],
            ['Tier 4', '3-4.9', 'Low Fit', 'Archive with rationale', 'No SLA'],
          ].map((row) => (
            <div key={row[0]}>
              {row.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function UsersView({ setShowManual }: { setShowManual: (value: boolean) => void }) {
  return (
    <div className="view-stack">
      <div className="view-heading split">
        <p>Manage account access, profile details, and roles.</p>
        <div className="header-buttons">
          <button className="icon-button" type="button" aria-label="Help">
            <HelpCircle size={18} />
          </button>
          <button className="primary-button" type="button" onClick={() => setShowManual(true)}>
            <UserPlus size={18} />
            New user
          </button>
        </div>
      </div>

      <div className="user-stats">
        <KpiCard label="Total Accounts" value="9" delta="" icon={Users} tone="violet" />
        <KpiCard label="Owners" value="4" delta="" icon={ShieldCheck} tone="blue" />
        <KpiCard label="Admins" value="4" delta="" icon={Gauge} tone="green" />
        <KpiCard label="Reviewers" value="1" delta="" icon={Eye} tone="amber" />
      </div>

      <article className="data-table-card">
        <header>
          <h2>Accounts <small>9</small></h2>
        </header>
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input placeholder="Search name or email" />
          </label>
          <button className="soft-button" type="button">
            All roles
            <ChevronDown size={16} />
          </button>
          <button className="soft-button" type="button">
            All statuses
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="user-table">
          <div className="table-head">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last Login</span>
            <span />
          </div>
          {users.map((user) => (
            <div key={user.email} className="table-row">
              <span className="person-cell">
                <i>{user.initials}</i>
                <span>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </span>
              </span>
              <RolePill role={user.role} />
              <span className="active-pill">
                <i />
                {user.status}
              </span>
              <time>{user.lastLogin}</time>
              <button className="icon-button subtle" type="button" aria-label={`Manage ${user.name}`}>
                <MoreHorizontal size={17} />
              </button>
            </div>
          ))}
        </div>
      </article>

      <ChartPanel title="User management activity" subtitle="Audit history for access changes">
        <div className="activity-list compact">
          {[
            ['User created', 'Assigned Owner to milad.olad@unilever.com', '7/9/2026, 7:43:16 PM'],
            ['Role changed', 'Admin to Owner for hebe.zuo2@unilever.com', '7/7/2026, 1:17:44 PM'],
          ].map(([title, copy, time]) => (
            <div key={title}>
              <span>
                <Mail size={16} />
              </span>
              <p>
                <strong>{title}</strong>
                <small>{copy}</small>
              </p>
              <time>{time}</time>
            </div>
          ))}
        </div>
      </ChartPanel>
    </div>
  )
}

function RolePill({ role }: { role: User['role'] }) {
  return <span className={`role-pill ${role.toLowerCase()}`}>{role}</span>
}

function SettingsView() {
  return (
    <div className="view-stack settings-view">
      <div className="view-heading">
        <p>Workspace controls for intake behavior, scoring automation, and reviewer notifications.</p>
      </div>
      <div className="settings-grid">
        {[
          ['AI evidence extraction', 'Run first-pass extraction for new submissions.', true],
          ['Decision SLA alerts', 'Notify owners before service-level targets are missed.', true],
          ['Require disqualifier notes', 'Block closure until each triggered hard filter has evidence.', true],
          ['Auto-assign reviewers', 'Route new submissions by region and business group.', false],
        ].map(([title, copy, enabled]) => (
          <article key={title as string} className="setting-card">
            <div>
              <strong>{title as string}</strong>
              <p>{copy as string}</p>
            </div>
            <button className={enabled ? 'toggle active' : 'toggle'} type="button" aria-label={`Toggle ${title}`}>
              <span />
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

function SegmentedControl({
  onChange,
  options,
  value,
}: {
  onChange: (value: string) => void
  options: string[]
  value: string
}) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? 'active' : ''}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function FiltersPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="filters-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2 id="filters-title">Filters</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        </header>
        {[
          ['Status', ['In Admin Review', 'AI Scoring', 'On Hold', 'Shortlisted']],
          ['Business Group', ['Home Care', 'Personal Care', 'Foods', 'Beauty & Wellbeing', 'Digital R&D']],
          ['Region', ['Europe', 'North America', 'Asia Pacific']],
          ['Tier', ['Tier 1', 'Tier 2', 'Tier 3']],
        ].map(([label, values]) => (
          <fieldset key={label as string}>
            <legend>{label as string}</legend>
            {(values as string[]).map((value) => (
              <label key={value} className="check-row">
                <input type="checkbox" />
                <span>{value}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <button className="primary-button full-width" type="button" onClick={onClose}>
          Apply filters
        </button>
      </aside>
    </div>
  )
}

function ManualSubmissionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="manual-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <h2 id="manual-title">New manual submission</h2>
            <p>Create an intake record for reviewer triage.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <label>
            Company name
            <input placeholder="Company Inc." />
          </label>
          <label>
            Solution name
            <input placeholder="Technology or platform" />
          </label>
          <label>
            Business group
            <select defaultValue="">
              <option value="" disabled>
                Select group
              </option>
              <option>Home Care</option>
              <option>Foods</option>
              <option>Personal Care</option>
              <option>Beauty & Wellbeing</option>
            </select>
          </label>
          <label>
            Region
            <select defaultValue="">
              <option value="" disabled>
                Select region
              </option>
              <option>Europe</option>
              <option>North America</option>
              <option>Asia Pacific</option>
            </select>
          </label>
          <label className="wide-field">
            Submission notes
            <textarea placeholder="Paste intake notes, context, or diligence hints." />
          </label>
        </div>
        <footer>
          <button className="soft-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onClose}>
            Create submission
          </button>
        </footer>
      </section>
    </div>
  )
}

function SubmissionDrawer({ onClose, submission }: { onClose: () => void; submission: Submission }) {
  const score = submission.score ?? 0
  return (
    <div className="overlay drawer-overlay" role="presentation" onMouseDown={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="submission-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p>{submission.company}</p>
            <h2 id="submission-title">{submission.name}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details">
            <X size={18} />
          </button>
        </header>
        <div className="score-ring" style={{ '--score': `${score * 10}%` } as React.CSSProperties}>
          <span>
            {submission.score ? submission.score : '-'}
            <small>/10</small>
          </span>
        </div>
        <div className="drawer-chips">
          <StatusPill status={submission.status} />
          {submission.tier && <span className="tier-pill">{submission.tier}</span>}
          <span className="region-chip">
            <MapPin size={13} />
            {submission.region}
          </span>
        </div>
        <section>
          <h3>Reviewer summary</h3>
          <p>{submission.summary}</p>
        </section>
        <section>
          <h3>Recommended next step</h3>
          <p>{submission.nextStep}</p>
        </section>
        <section>
          <h3>Evidence readiness</h3>
          <div className="readiness-list">
            {['Hard filters checked', 'Category fit reviewed', 'Commercial proof attached'].map((item, index) => (
              <span key={item}>
                <CheckCircle2 size={16} className={index === 2 && submission.status === 'Submitted' ? 'muted' : ''} />
                {item}
              </span>
            ))}
          </div>
        </section>
        <button className="primary-button full-width" type="button">
          Open diligence workspace
        </button>
      </aside>
    </div>
  )
}

export default App
