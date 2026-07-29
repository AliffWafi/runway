export const STATUS_CONFIG = {
  wishlist: {
    id: 'wishlist',
    label: 'Wishlist',
    color: 'var(--status-wishlist)',
    badgeClass: 'badge-wishlist',
    description: 'Interested / preparing to apply'
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    color: 'var(--status-applied)',
    badgeClass: 'badge-applied',
    description: 'Submitted application'
  },
  screening: {
    id: 'screening',
    label: 'Screening',
    color: 'var(--status-screening)',
    badgeClass: 'badge-screening',
    description: 'Recruiter call / HR screen'
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    color: 'var(--status-interviewing)',
    badgeClass: 'badge-interviewing',
    description: 'Active interviews in progress'
  },
  offer: {
    id: 'offer',
    label: 'Offer',
    color: 'var(--status-offer)',
    badgeClass: 'badge-offer',
    description: 'Job offer extended!'
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    color: 'var(--status-rejected)',
    badgeClass: 'badge-rejected',
    description: 'Application closed / declined'
  }
};

export const INITIAL_JOBS = [
  {
    id: 'job-1',
    company: 'Stripe',
    title: 'Senior Frontend Engineer',
    location: 'Remote (US/EU)',
    salary: '$180,000 - $210,000',
    url: 'https://stripe.com/jobs',
    appliedDate: '2026-07-20',
    status: 'interviewing',
    tags: ['Remote', 'React', 'Fintech', 'High Priority'],
    notes: 'Technical interview scheduled with Lead Engineer. Prepared system design notes and state management examples.',
    history: [
      { status: 'applied', date: '2026-07-20', note: 'Submitted resume via referral.' },
      { status: 'screening', date: '2026-07-23', note: 'Recruiter call with Sarah.' },
      { status: 'interviewing', date: '2026-07-26', note: 'Passed technical round.' }
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
    status: 'applied',
    tags: ['Hybrid', 'Next.js', 'DevTools'],
    notes: 'Applied through company website. Highlighted experience building design systems.',
    history: [
      { status: 'applied', date: '2026-07-22', note: 'Application submitted.' }
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
    status: 'offer',
    tags: ['Remote', 'UI/UX', 'TypeScript'],
    notes: 'Offer letter received! Reviewing compensation package and equity vesting schedule.',
    history: [
      { status: 'applied', date: '2026-07-15', note: 'Applied online.' },
      { status: 'screening', date: '2026-07-18', note: 'Recruiter screen.' },
      { status: 'interviewing', date: '2026-07-21', note: 'Full loop completed.' },
      { status: 'offer', date: '2026-07-26', note: 'Official offer extended.' }
    ]
  },
  {
    id: 'job-4',
    company: 'Linear',
    title: 'Full Stack Engineer',
    location: 'Remote',
    salary: '$160,000 - $185,000',
    url: 'https://linear.app/careers',
    appliedDate: '2026-07-25',
    status: 'screening',
    tags: ['Remote', 'Node.js', 'GraphQL'],
    notes: 'Recruiter call scheduled for tomorrow morning.',
    history: [
      { status: 'applied', date: '2026-07-25', note: 'Application submitted.' },
      { status: 'screening', date: '2026-07-27', note: 'Recruiter reached out.' }
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
    status: 'wishlist',
    tags: ['Onsite', 'Architecture', 'Design System'],
    notes: 'Updating portfolio before asking contact for internal referral.',
    history: []
  }
];
