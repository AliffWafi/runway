export type ApplicationStatus = 
  | 'taxiing' 
  | 'holding' 
  | 'radar_contact'
  | 'cleared_for_takeoff' 
  | 'airborne' 
  | 'return_to_gate' 
  | 'holding_pattern';

export interface ActivityLog {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  location?: string;
  salary?: string;
  url?: string;
  appliedDate: string;
  status: ApplicationStatus;
  tags?: string[];
  notes?: string;
  history?: ActivityLog[];
}

export interface StatusConfig {
  id: ApplicationStatus;
  label: string;
  sublabel: string;
  color: string;
  badgeClass: string;
  description: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  taxiing: {
    id: 'taxiing',
    label: 'Taxiing',
    sublabel: '(Applied)',
    color: '#83a598', // Gruvbox Blue
    badgeClass: 'badge-taxiing',
    description: 'Application submitted, moving down the taxiway'
  },
  holding: {
    id: 'holding',
    label: 'Holding',
    sublabel: '(Waiting Response)',
    color: '#8ec07c', // Gruvbox Aqua
    badgeClass: 'badge-holding',
    description: 'In queue awaiting recruiter or hiring manager response'
  },
  radar_contact: {
    id: 'radar_contact',
    label: 'Radar Contact',
    sublabel: '(Viewed)',
    color: '#fe8019', // Gruvbox Orange
    badgeClass: 'badge-radar',
    description: 'Recruiter or hiring manager acquired radar contact / viewed application'
  },
  cleared_for_takeoff: {
    id: 'cleared_for_takeoff',
    label: 'Cleared for Takeoff',
    sublabel: '(Assessment/Interview)',
    color: '#fabd2f', // Gruvbox Yellow
    badgeClass: 'badge-cleared',
    description: 'Active interviews and technical assessment in progress'
  },
  airborne: {
    id: 'airborne',
    label: 'Airborne ✈️',
    sublabel: '(Job Secured)',
    color: '#b8bb26', // Gruvbox Green
    badgeClass: 'badge-airborne',
    description: 'Job offer extended & flight path secured!'
  },
  return_to_gate: {
    id: 'return_to_gate',
    label: 'Return to Gate',
    sublabel: '(Rejected)',
    color: '#fb4934', // Gruvbox Red
    badgeClass: 'badge-gate',
    description: 'Application declined / returned to gate'
  },
  holding_pattern: {
    id: 'holding_pattern',
    label: 'Holding Pattern 🌀',
    sublabel: '(Ghosted)',
    color: '#d3869b', // Gruvbox Purple
    badgeClass: 'badge-pattern',
    description: 'No response or update received for over 30 days'
  }
};

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    title: 'Senior Frontend Engineer',
    location: 'Remote (US/EU)',
    salary: '$180,000 - $210,000',
    url: 'https://stripe.com/jobs',
    appliedDate: '2026-07-20',
    status: 'cleared_for_takeoff',
    tags: ['Remote', 'React', 'Fintech', 'High Priority'],
    notes: 'Technical system design interview scheduled with Lead Engineer. Reviewing state management & performance.',
    history: [
      { status: 'taxiing', date: '2026-07-20', note: 'Submitted application.' },
      { status: 'holding', date: '2026-07-23', note: 'Awaiting recruiter response.' },
      { status: 'cleared_for_takeoff', date: '2026-07-26', note: 'Passed screening call!' }
    ]
  },
  {
    id: 'job-2',
    company: 'Vercel',
    title: 'Product Engineer',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$165,000 - $190,000',
    url: 'https://vercel.com/careers',
    appliedDate: '2026-07-22',
    status: 'radar_contact',
    tags: ['Hybrid', 'Next.js', 'DevTools'],
    notes: 'Application viewed on career portal.',
    history: [
      { status: 'taxiing', date: '2026-07-22', note: 'Submitted resume.' },
      { status: 'radar_contact', date: '2026-07-24', note: 'Application viewed by recruiter.' }
    ]
  }
];
