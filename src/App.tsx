import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpDown,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
type InsightTab = 'Overview' | 'Geographies' | 'Business Groups' | 'Product Stages' | 'Lifecycle'
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
  const [showManual, setShowManual] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [compactNav, setCompactNav] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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

  const title = showManual ? 'New manual submission' : {
    submissions: 'Submissions',
    insights: 'Insights',
    scoring: 'Scoring Guide',
    users: 'Users',
    settings: 'Settings',
  }[activeView]

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'nav-collapsed' : ''}`} data-theme={theme}>
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
          <button
            className="sidebar-collapse"
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
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
              title={item.label}
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
          title="Settings"
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
          {!showManual && activeView === 'submissions' && (
            <SubmissionsView
              closedSubmissions={closedSubmissions}
              filteredSubmissions={filteredSubmissions}
              search={search}
              setSearch={setSearch}
              setSelectedSubmission={setSelectedSubmission}
              setShowManual={setShowManual}
              setTimeRange={setTimeRange}
              timeRange={timeRange}
            />
          )}
          {showManual && <ManualSubmissionPage onClose={() => setShowManual(false)} />}
          {!showManual && activeView === 'insights' && <InsightsView timeRange={timeRange} setTimeRange={setTimeRange} />}
          {!showManual && activeView === 'scoring' && <ScoringGuideView />}
          {!showManual && activeView === 'users' && <UsersView setShowCreateUser={setShowCreateUser} />}
          {!showManual && activeView === 'settings' && <SettingsView />}
        </section>
      </main>

      {showCreateUser && <CreateUserModal onClose={() => setShowCreateUser(false)} />}
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
  setShowManual,
  setTimeRange,
  timeRange,
}: SubmissionsViewProps) {
  const [popover, setPopover] = useState<'help' | 'sort' | 'filters' | 'calendar' | null>(null)

  return (
    <div className="view-stack">
      <div className="view-heading split">
        <p>
          <strong>10</strong> total submissions
        </p>
        <div className="header-buttons">
          <button
            className="icon-button"
            type="button"
            aria-label="Help"
            onClick={() => setPopover((current) => (current === 'help' ? null : 'help'))}
          >
            <HelpCircle size={18} />
          </button>
          {popover === 'help' && <HelpPopover onClose={() => setPopover(null)} />}
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
          onCustomClick={() => setPopover((current) => (current === 'calendar' ? null : 'calendar'))}
        />
        {popover === 'calendar' && <CalendarPopover onClose={() => setPopover(null)} setTimeRange={setTimeRange} />}
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or company..."
          />
        </label>
        <div className="toolbar-popover-anchor">
          <button
            className="soft-button"
            type="button"
            aria-label="Sort submissions"
            onClick={() => setPopover((current) => (current === 'sort' ? null : 'sort'))}
          >
            <ArrowUpDown size={16} />
            Sort: Date
          </button>
          {popover === 'sort' && <SortPopover onClose={() => setPopover(null)} />}
        </div>
        <div className="toolbar-popover-anchor">
          <button
            className="soft-button"
            type="button"
            onClick={() => setPopover((current) => (current === 'filters' ? null : 'filters'))}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          {popover === 'filters' && <FiltersPopover onClose={() => setPopover(null)} />}
        </div>
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
  const [activeTab, setActiveTab] = useState<InsightTab>('Overview')
  const [showCalendar, setShowCalendar] = useState(false)
  const tabs: [InsightTab, typeof BarChart3][] = [
    ['Overview', BarChart3],
    ['Geographies', Globe2],
    ['Business Groups', BriefcaseBusiness],
    ['Product Stages', Layers3],
    ['Lifecycle', Activity],
  ]

  return (
    <div className="view-stack">
      <SegmentedControl
        value={timeRange}
        options={['7 Days', '30 Days', '90 Days', 'All Time', 'Custom']}
        onChange={setTimeRange}
        onCustomClick={() => setShowCalendar((current) => !current)}
      />
      {showCalendar && <CalendarPopover onClose={() => setShowCalendar(false)} setTimeRange={setTimeRange} />}
      <div className="data-tabs">
        {tabs.map(([label, Icon]) => (
          <button
            key={label}
            className={activeTab === label ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab(label)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && <InsightsOverview />}
      {activeTab === 'Geographies' && <GeographiesPanel />}
      {activeTab === 'Business Groups' && <BusinessGroupsPanel />}
      {activeTab === 'Product Stages' && <StagePanel />}
      {activeTab === 'Lifecycle' && <LifecyclePanel />}
    </div>
  )
}

function InsightsOverview() {
  return (
    <>
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
    </>
  )
}

function GeographiesPanel() {
  const regions = [
    ['Europe', '18', '34%', '#6467f2'],
    ['North America', '14', '26%', '#3b82f6'],
    ['Asia Pacific', '9', '17%', '#10b981'],
    ['Middle East', '5', '9%', '#f59e0b'],
    ['Africa', '4', '8%', '#ff464b'],
    ['South America', '3', '6%', '#ec4899'],
  ] as const

  return (
    <div className="insight-tab-panel">
      <ChartPanel className="map-panel" title="Geographic Distribution" subtitle="Hover over region markers to view submission details">
        <div className="map-canvas">
          {[
            ['north-america', '14', '#3b82f6'],
            ['south-america', '3', '#ec4899'],
            ['europe', '18', '#6467f2'],
            ['africa', '4', '#ff464b'],
            ['middle-east', '5', '#f59e0b'],
            ['asia-pacific', '9', '#10b981'],
          ].map(([region, value, color]) => (
            <span key={region} className={`map-marker ${region}`} style={{ '--marker': color } as React.CSSProperties}>
              {value}
            </span>
          ))}
          <i className="land north-america" />
          <i className="land greenland" />
          <i className="land south-america" />
          <i className="land europe" />
          <i className="land africa" />
          <i className="land asia" />
          <i className="land middle-east" />
          <i className="land australia" />
        </div>
      </ChartPanel>
      <div className="region-card-grid">
        {regions.map(([label, value, percent, color]) => (
          <article key={label} className="region-card">
            <p>
              <span>
                <i style={{ background: color }} />
                {label}
              </span>
              <strong>{value}</strong>
            </p>
            <em>
              <i style={{ width: percent, background: color }} />
            </em>
            <small>{percent} of total submissions</small>
          </article>
        ))}
      </div>
    </div>
  )
}

function BusinessGroupsPanel() {
  const groups = [
    ['Beauty & Wellbeing', '14', '29%', '#ec4899'],
    ['Home Care', '12', '24%', '#3b82f6'],
    ['Foods & Refreshment', '9', '18%', '#10b981'],
    ['Personal Care', '7', '14%', '#8b5cf6'],
    ['Digital R&D', '4', '8%', '#f59e0b'],
    ['Nutrition', '3', '6%', '#ff464b'],
  ] as const

  return (
    <div className="insight-tab-panel">
      <div className="business-grid">
        <ChartPanel className="business-donut-panel" title="Distribution" subtitle="Submissions by business unit">
          <div className="business-donut-layout">
            <div className="business-donut" />
            <div className="business-legend">
              {groups.map(([label, value, , color]) => (
                <p key={label}>
                  <span>
                    <i style={{ background: color }} />
                    {label}
                  </span>
                  <strong>{value}</strong>
                </p>
              ))}
            </div>
          </div>
        </ChartPanel>
        <ChartPanel title="Volume Breakdown" subtitle="Submission count per business group">
          <div className="ranked-bars business-bars">
            {groups.map(([label, value, percent, color]) => (
              <div key={label}>
                <p>
                  <strong>{label}</strong>
                  <span>
                    {value} <small>({percent})</small>
                  </span>
                </p>
                <em>
                  <i style={{ width: percent, background: color }} />
                </em>
              </div>
            ))}
          </div>
        </ChartPanel>
      </div>
      <div className="business-stat-grid">
        {groups.map(([label, value, , color]) => (
          <article key={label} className="business-stat-card">
            <span style={{ color, background: `${color}22` }}>
              <BriefcaseBusiness size={18} />
            </span>
            <strong>{value}</strong>
            <small>{label}</small>
          </article>
        ))}
      </div>
    </div>
  )
}

function StagePanel() {
  const stages = [
    ['Concept / Ideation', '18', '#6467f2'],
    ['Prototype', '14', '#8b5cf6'],
    ['Proof of Concept', '10', '#22c7dc'],
    ['Pilot Scale', '7', '#10b981'],
    ['Scale-Up', '4', '#f59e0b'],
    ['Commercial Ready', '2', '#ff464b'],
  ] as const

  return (
    <div className="insight-tab-panel">
      <div className="stage-main-grid">
        <ChartPanel title="Innovation Funnel" subtitle="Submissions by development stage">
          <div className="funnel-list">
            {stages.map(([label, value, color], index) => (
              <div key={label}>
                <span style={{ background: color }}>{index + 1}</span>
                <p>
                  <strong>{label}</strong>
                  <small>{value}</small>
                </p>
                <em>
                  <i style={{ width: `${Number(value) * 4.5}%`, borderColor: color, background: `${color}30` }} />
                </em>
              </div>
            ))}
          </div>
        </ChartPanel>
        <ChartPanel title="Stage Volume" subtitle="Count of submissions at each stage">
          <div className="horizontal-bars">
            {stages.map(([label, value, color]) => (
              <div key={label}>
                <span>{label}</span>
                <em>
                  <i style={{ width: `${Number(value) * 5}%`, background: color }} />
                </em>
              </div>
            ))}
          </div>
        </ChartPanel>
      </div>
      <div className="stage-card-grid">
        {stages.map(([label, value, color], index) => (
          <article key={label} className="stage-card">
            <p>
              <span>Stage {index + 1}</span>
              <i style={{ background: color }} />
            </p>
            <strong>{value}</strong>
            <small>{label}</small>
            <em>
              <i style={{ width: `${Number(value) * 4.5}%`, background: color }} />
            </em>
          </article>
        ))}
      </div>
    </div>
  )
}

function LifecyclePanel() {
  const flow = [
    ['Submitted', '61', '2d avg', '#64748b'],
    ['AI Scoring', '55', '3d avg', '#8b5cf6'],
    ['Awaiting Decision', '48', '14d avg', '#f59e0b'],
    ['In Admin Review', '35', '8d avg', '#3b82f6'],
    ['Shortlisted', '18', '21d avg', '#10b981'],
    ['Handed Off', '12', '5d avg', '#22c7dc'],
    ['On Hold', '8', '45d avg', '#f97316'],
    ['Declined', '7', '4d avg', '#ff464b'],
    ['Closed (DQ)', '3', '7d avg', '#ff3136'],
  ] as const

  return (
    <div className="insight-tab-panel">
      <ChartPanel className="full" title="Submission Lifecycle Flow" subtitle="Volume and average time at each stage">
        <div className="lifecycle-ribbon">
          {flow.map(([label, value, avg, color], index) => (
            <article key={label} style={{ '--stage-color': color } as React.CSSProperties}>
              <strong>{value}</strong>
              <small>{avg}</small>
              <span>{label}</span>
              {index < flow.length - 1 && <i />}
            </article>
          ))}
        </div>
      </ChartPanel>
      <div className="lifecycle-grid">
        <ChartPanel title="Volume by Status" subtitle="Submissions currently in each stage">
          <div className="status-volume-chart">
            {flow.map(([label, value, , color]) => (
              <div key={label}>
                <i style={{ height: `${Number(value) * 2}px`, background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </ChartPanel>
        <ChartPanel title="Avg. Days per Stage" subtitle="How long submissions typically spend at each stage">
          <div className="ranked-bars lifecycle-bars">
            {[
              ['On Hold', '45d', '100%', '#f97316'],
              ['Shortlisted', '21d', '47%', '#10b981'],
              ['Awaiting Decision', '14d', '31%', '#f59e0b'],
              ['In Admin Review', '8d', '18%', '#3b82f6'],
              ['Closed (DQ)', '7d', '16%', '#ff464b'],
              ['Handed Off', '5d', '11%', '#22c7dc'],
              ['Declined', '4d', '9%', '#ff464b'],
              ['AI Scoring', '3d', '7%', '#8b5cf6'],
              ['Submitted', '2d', '4%', '#64748b'],
            ].map(([label, value, width, color]) => (
              <div key={label}>
                <p>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </p>
                <em>
                  <i style={{ width, background: color }} />
                </em>
              </div>
            ))}
          </div>
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
  const tierOutcomes = [
    {
      tier: 'Tier 1',
      range: '8-10',
      label: 'Strategic Priority',
      action: 'Immediate outreach; escalate to category leadership; fast-track partnership discussion',
      sla: '48 hours initial response',
      tone: 'green',
    },
    {
      tier: 'Tier 2',
      range: '6.5-7.9',
      label: 'High Potential',
      action: 'Proactive outreach within 2 weeks; assign category owner; develop partnership thesis',
      sla: '2 weeks evaluation completion',
      tone: 'blue',
    },
    {
      tier: 'Tier 3',
      range: '5-6.4',
      label: 'Monitor & Develop',
      action: 'Add to watch list; quarterly review; engage if strategic trigger occurs',
      sla: 'Acknowledgment within 1 week',
      tone: 'amber',
    },
    {
      tier: 'Tier 4',
      range: '3-4.9',
      label: 'Low Priority',
      action: 'Archive for future reference; no active engagement; re-evaluate if company pivots',
      sla: 'Response within 1 week',
      tone: 'orange',
    },
    {
      tier: 'Tier 5',
      range: '0-2.9',
      label: 'Not Aligned',
      action: 'Polite decline with brief rationale; do not add to active tracking',
      sla: 'Response within 1 week',
      tone: 'red',
    },
  ]

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
          <div className="tier-table-head" role="row">
            <span>Tier</span>
            <span>Score Range</span>
            <span>Label</span>
            <span>Action</span>
            <span>SLA</span>
          </div>
          {tierOutcomes.map((row) => (
            <div key={row.tier} className={`tier-table-row tier-${row.tone}`} role="row">
              <strong>{row.tier}</strong>
              <span className="tier-range">{row.range}</span>
              <span className="tier-label-pill">{row.label}</span>
              <p>{row.action}</p>
              <em>{row.sla}</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function UsersView({ setShowCreateUser }: { setShowCreateUser: (value: boolean) => void }) {
  return (
    <div className="view-stack">
      <div className="view-heading split">
        <p>Manage account access, profile details, and roles.</p>
        <div className="header-buttons">
          <button className="icon-button" type="button" aria-label="Help">
            <HelpCircle size={18} />
          </button>
          <button className="primary-button" type="button" onClick={() => setShowCreateUser(true)}>
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
  onCustomClick,
  onChange,
  options,
  value,
}: {
  onCustomClick?: () => void
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
          onClick={() => {
            onChange(option)
            if (option === 'Custom') onCustomClick?.()
          }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function HelpPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="floating-popover help-popover" role="dialog" aria-label="Submissions help">
      <header>
        <strong>Submissions</strong>
        <button type="button" aria-label="Close help" onClick={onClose}>
          <X size={15} />
        </button>
      </header>
      <section>
        <h3>Start with the open queue</h3>
        <p>Review ready-for-triage and in-review submissions first. Closed outcomes stay collapsed so current work remains easy to scan.</p>
      </section>
      <section>
        <h3>Use score as a signal</h3>
        <p>The UFS score and tier help prioritize attention, but final decisions should use the full report, evidence, and reviewer notes.</p>
      </section>
      <section>
        <h3>Manual submissions</h3>
        <p>Use manual entry only for opportunities received outside the public portal so the pipeline and audit history stay complete.</p>
      </section>
    </div>
  )
}

function SortPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="floating-popover compact-popover" role="menu" aria-label="Sort options">
      {['Date submitted', 'Company Name', 'UFS Score', 'Tier priority'].map((option) => (
        <button key={option} type="button" role="menuitem" onClick={onClose}>
          {option}
        </button>
      ))}
    </div>
  )
}

function CalendarPopover({
  onClose,
  setTimeRange,
}: {
  onClose: () => void
  setTimeRange: (value: string) => void
}) {
  const days = Array.from({ length: 31 }, (_, index) => index + 1)
  return (
    <div className="floating-popover calendar-popover" role="dialog" aria-label="Custom date range">
      <header>
        <strong>
          <CalendarDays size={16} />
          Custom range
        </strong>
        <button type="button" aria-label="Close calendar" onClick={onClose}>
          <X size={15} />
        </button>
      </header>
      <div className="calendar-meta">
        <button type="button">Jun 2026</button>
        <button type="button">Jul 2026</button>
      </div>
      <div className="calendar-grid" aria-label="July 2026 calendar">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
        {days.map((day) => (
          <button key={day} className={day >= 7 && day <= 13 ? 'selected' : ''} type="button">
            {day}
          </button>
        ))}
      </div>
      <div className="calendar-fields">
        <label>
          Start
          <input defaultValue="2026-07-07" />
        </label>
        <label>
          End
          <input defaultValue="2026-07-13" />
        </label>
      </div>
      <footer>
        <button className="soft-button" type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setTimeRange('Custom')
            onClose()
          }}
        >
          Apply range
        </button>
      </footer>
    </div>
  )
}

function FiltersPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="floating-popover filters-popover" role="dialog" aria-label="Filters">
      <header>
        <strong>Filters</strong>
        <button type="button" aria-label="Close filters" onClick={onClose}>
          <X size={15} />
        </button>
      </header>
      {[
        ['Status', ['Submitted', 'AI Scoring', 'Awaiting Decision', 'In Admin Review', 'On Hold', 'Shortlisted', 'Handed Off', 'Declined', 'Closed (DQ)']],
        ['Tier', ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5']],
        ['Region', ['Europe', 'North America', 'Asia Pacific', 'Middle East & Africa']],
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
      <footer>
        <button className="ghost-button" type="button" onClick={onClose}>
          Clear All
        </button>
        <button className="primary-button" type="button" onClick={onClose}>
          Apply
        </button>
      </footer>
    </div>
  )
}

function ManualSubmissionPage({ onClose }: { onClose: () => void }) {
  return (
    <div className="manual-page view-stack">
      <div className="view-heading split">
        <div>
          <h2>New manual submission</h2>
          <p>Backfill a submission collected outside the public portal.</p>
        </div>
        <button className="soft-button" type="button" onClick={onClose}>
          Back
        </button>
      </div>
      <ManualSection title="Contact" fields={['Email *', 'Full name', 'Job title', 'Phone', 'LinkedIn']} />
      <ManualSection
        title="Company"
        fields={[
          'Company name',
          'Website',
          'Company LinkedIn',
          'HQ region',
          'HQ country',
          'Years in operation',
          'Team size',
          'Corporate R&D experience',
          'CPG partners',
        ]}
      />
      <ManualSection
        title="Product"
        fields={['Product name', 'Stage', 'Industry sectors (comma separated)', 'Product link', 'Demo video URL', 'Operating countries']}
      />
      <section className="manual-section">
        <h3>Pitch</h3>
        {['Pitch / overview', 'Why Unilever', 'Competitive landscape', 'Regulatory awareness', 'Additional info'].map((label) => (
          <label key={label} className="wide-field">
            {label}
            <textarea />
          </label>
        ))}
      </section>
      <footer className="manual-actions">
        <button className="soft-button" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" type="button" onClick={onClose}>
          Create draft
        </button>
      </footer>
    </div>
  )
}

function ManualSection({ fields, title }: { fields: string[]; title: string }) {
  return (
    <section className="manual-section">
      <h3>{title}</h3>
      <div className="manual-form-grid">
        {fields.map((field) => (
          <label key={field}>
            {field}
            <input />
          </label>
        ))}
      </div>
    </section>
  )
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <section className="modal-card create-user-modal" role="dialog" aria-modal="true" aria-labelledby="create-user-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <h2 id="create-user-title">Create user</h2>
            <p>A temporary password will be generated and shown to you exactly once. Share it through a secure channel.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close create user">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid single-column">
          <label>
            Email
            <input placeholder="someone@unilever.com" />
          </label>
          <label>
            Full name
            <input placeholder="Jane Doe" />
          </label>
          <label>
            Role
            <select defaultValue="Reviewer">
              <option>Reviewer</option>
              <option>Admin</option>
              <option>Owner</option>
              <option>Viewer</option>
            </select>
          </label>
          <p>Read-only access to submissions, scores, and AI analysis.</p>
        </div>
        <footer>
          <button className="soft-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onClose}>
            Create user
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
