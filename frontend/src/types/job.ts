export type ApplicationStatus = 
  | 'taxiing' 
  | 'holding' 
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
    sublabel: 'Applied',
    color: '#83a598', // Gruvbox Blue
    badgeClass: 'badge-taxiing',
    description: 'Application submitted, moving down the taxiway'
  },
  holding: {
    id: 'holding',
    label: 'Holding',
    sublabel: 'Awaiting Response',
    color: '#8ec07c', // Gruvbox Aqua
    badgeClass: 'badge-holding',
    description: 'In queue awaiting recruiter or hiring manager response'
  },
  cleared_for_takeoff: {
    id: 'cleared_for_takeoff',
    label: 'Cleared for Takeoff',
    sublabel: 'Interview / Assessment',
    color: '#fabd2f', // Gruvbox Yellow
    badgeClass: 'badge-cleared',
    description: 'Active interviews and technical assessment in progress'
  },
  airborne: {
    id: 'airborne',
    label: 'Airborne ✈️',
    sublabel: 'Secured Job',
    color: '#b8bb26', // Gruvbox Green
    badgeClass: 'badge-airborne',
    description: 'Job offer extended & flight path secured!'
  },
  return_to_gate: {
    id: 'return_to_gate',
    label: 'Return to Gate',
    sublabel: 'Rejected',
    color: '#fb4934', // Gruvbox Red
    badgeClass: 'badge-gate',
    description: 'Application declined / returned to gate'
  },
  holding_pattern: {
    id: 'holding_pattern',
    label: 'Holding Pattern 🌀',
    sublabel: 'Ghosted (>30 days)',
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
    status: 'holding',
    tags: ['Hybrid', 'Next.js', 'DevTools'],
    notes: 'Applied on career page. Highlighted Next.js App Router experience.',
    history: [
      { status: 'taxiing', date: '2026-07-22', note: 'Submitted resume.' },
      { status: 'holding', date: '2026-07-24', note: 'Application under review.' }
    ]
  },
  {
    id: 'job-3',
    company: 'Figma',
    title: 'Design Systems Developer',
    location: 'Remote',
    salary: '$170,000 - $200,000',
    url: 'https://figma.com/careers',
    appliedDate: '2026-07-15',
    status: 'airborne',
    tags: ['Remote', 'UI/UX', 'TypeScript'],
    notes: 'Official offer letter received! Evaluating equity package and perks.',
    history: [
      { status: 'taxiing', date: '2026-07-15', note: 'Applied online.' },
      { status: 'holding', date: '2026-07-18', note: 'Recruiter screen.' },
      { status: 'cleared_for_takeoff', date: '2026-07-21', note: 'Onsite loop completed.' },
      { status: 'airborne', date: '2026-07-26', note: 'Received official offer!' }
    ]
  },
  {
    id: 'job-4',
    company: 'Linear',
    title: 'Full Stack Engineer',
    location: 'Remote',
    salary: '$160,000 - $185,000',
    url: 'https://linear.app/careers',
    appliedDate: '2026-06-15',
    status: 'holding_pattern',
    tags: ['Remote', 'Node.js', 'GraphQL'],
    notes: 'No response received for over 40 days.',
    history: [
      { status: 'taxiing', date: '2026-06-15', note: 'Applied.' },
      { status: 'holding_pattern', date: '2026-07-25', note: 'Flagged as holding pattern (ghosted).' }
    ]
  },
  {
    id: 'job-5',
    company: 'Airbnb',
    title: 'Staff UI Engineer',
    location: 'San Francisco, CA',
    salary: '$200,000 - $240,000',
    url: 'https://careers.airbnb.com',
    appliedDate: '2026-07-10',
    status: 'taxiing',
    tags: ['Onsite', 'Architecture', 'Design System'],
    notes: 'Submitted application with referral code.',
    history: [
      { status: 'taxiing', date: '2026-07-10', note: 'Taxiing on runway.' }
    ]
  }
];
