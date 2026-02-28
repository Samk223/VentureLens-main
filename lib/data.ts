export type Company = {
  id: string;
  name: string;
  domain: string;
  sector: string;
  stage: string;
  location: string;
  founded: number;
  description: string;
  tags: string[];
};

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Vercel',
    domain: 'vercel.com',
    sector: 'Developer Tools',
    stage: 'Series D',
    location: 'San Francisco, CA',
    founded: 2015,
    description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
    tags: ['Next.js', 'Hosting', 'Frontend', 'Cloud'],
    signals: [
      { id: 's1', type: 'Product', description: 'Launched v0', date: '2023-10-25' },
      { id: 's2', type: 'Funding', description: 'Raised $250M Series D', date: '2024-05-16' }
    ]
  },
  {
    id: '2',
    name: 'Stripe',
    domain: 'stripe.com',
    sector: 'Fintech',
    stage: 'Late Stage',
    location: 'San Francisco, CA',
    founded: 2010,
    description: 'Financial infrastructure platform for the internet. Millions of companies of all sizes use Stripe online and in person to accept payments, send payouts, automate financial processes, and ultimately grow revenue.',
    tags: ['Payments', 'API', 'Finance', 'B2B'],
    signals: [
      { id: 's3', type: 'Product', description: 'Launched Crypto Onramp', date: '2023-05-04' },
      { id: 's4', type: 'Financial', description: 'Reported $1T in total payment volume', date: '2024-02-14' }
    ]
  },
  {
    id: '3',
    name: 'OpenAI',
    domain: 'openai.com',
    sector: 'AI/ML',
    stage: 'Late Stage',
    location: 'San Francisco, CA',
    founded: 2015,
    description: 'AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.',
    tags: ['Generative AI', 'LLM', 'Research', 'AGI'],
    signals: [
      { id: 's5', type: 'Product', description: 'Launched GPT-4o', date: '2024-05-13' },
      { id: 's6', type: 'News', description: 'Sam Altman returns as CEO', date: '2023-11-21' }
    ]
  },
  {
    id: '4',
    name: 'Anthropic',
    domain: 'anthropic.com',
    sector: 'AI/ML',
    stage: 'Series C',
    location: 'San Francisco, CA',
    founded: 2021,
    description: 'An AI safety and research company that builds reliable, interpretable, and steerable AI systems.',
    tags: ['Safety', 'LLM', 'Claude', 'Research'],
    signals: [
      { id: 's7', type: 'Product', description: 'Launched Claude 3.5 Sonnet', date: '2024-06-20' },
      { id: 's8', type: 'Funding', description: 'Raised $4B from Amazon', date: '2023-09-25' }
    ]
  },
  {
    id: '5',
    name: 'Supabase',
    domain: 'supabase.com',
    sector: 'Developer Tools',
    stage: 'Series B',
    location: 'Remote',
    founded: 2020,
    description: 'The open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.',
    tags: ['Postgres', 'BaaS', 'Open Source', 'Database'],
    signals: [
      { id: 's9', type: 'Product', description: 'Launched Supabase Branching', date: '2023-08-14' },
      { id: 's10', type: 'Funding', description: 'Raised $80M Series B', date: '2022-05-10' }
    ]
  },
  {
    id: '6',
    name: 'Linear',
    domain: 'linear.app',
    sector: 'Productivity',
    stage: 'Series B',
    location: 'San Francisco, CA',
    founded: 2019,
    description: 'Linear is a purpose-built tool for planning and building products. Streamline issues, projects, and product roadmaps.',
    tags: ['Project Management', 'Design', 'B2B SaaS'],
    signals: [
      { id: 's11', type: 'Product', description: 'Launched Linear Insights', date: '2023-09-15' },
      { id: 's12', type: 'Funding', description: 'Raised $35M Series B', date: '2023-01-10' }
    ]
  },
  {
    id: '7',
    name: 'Notion',
    domain: 'notion.so',
    sector: 'Productivity',
    stage: 'Late Stage',
    location: 'San Francisco, CA',
    founded: 2013,
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    tags: ['Workspace', 'Collaboration', 'B2B SaaS', 'No-code'],
    signals: [
      { id: 's13', type: 'Product', description: 'Launched Notion AI', date: '2023-02-22' },
      { id: 's14', type: 'Acquisition', description: 'Acquired Cron', date: '2022-06-09' }
    ]
  },
  {
    id: '8',
    name: 'Figma',
    domain: 'figma.com',
    sector: 'Design Tools',
    stage: 'Late Stage',
    location: 'San Francisco, CA',
    founded: 2012,
    description: 'Figma is the leading collaborative design tool for building meaningful products.',
    tags: ['Design', 'Collaboration', 'Prototyping'],
    signals: [
      { id: 's15', type: 'Product', description: 'Launched Dev Mode', date: '2023-06-21' },
      { id: 's16', type: 'News', description: 'Adobe acquisition called off', date: '2023-12-18' }
    ]
  },
  {
    id: '9',
    name: 'Docker',
    domain: 'docker.com',
    sector: 'Developer Tools',
    stage: 'Late Stage',
    location: 'Palo Alto, CA',
    founded: 2013,
    description: 'Docker helps developers build, share, and run applications anywhere — without tedious environment configuration or management.',
    tags: ['Containers', 'DevOps', 'Cloud Native'],
    signals: [
      { id: 's17', type: 'Product', description: 'Launched Docker Scout', date: '2023-10-04' },
      { id: 's18', type: 'Funding', description: 'Raised $105M Series C', date: '2022-03-31' }
    ]
  },
  {
    id: '10',
    name: 'Datadog',
    domain: 'datadoghq.com',
    sector: 'Cloud Infrastructure',
    stage: 'Public',
    location: 'New York, NY',
    founded: 2010,
    description: 'Monitoring and security platform for cloud applications. We bring together end-to-end traces, metrics, and logs to make your applications, infrastructure, and third-party services entirely observable.',
    tags: ['Observability', 'Security', 'Cloud', 'Monitoring'],
    signals: [
      { id: 's19', type: 'Product', description: 'Launched LLM Observability', date: '2023-08-02' },
      { id: 's20', type: 'Financial', description: 'Reported strong Q3 earnings', date: '2023-11-07' }
    ]
  },
  {
    id: '11',
    name: 'Snowflake',
    domain: 'snowflake.com',
    sector: 'Data Infrastructure',
    stage: 'Public',
    location: 'Bozeman, MT',
    founded: 2012,
    description: 'Snowflake delivers the Data Cloud — a global network where thousands of organizations mobilize data with near-unlimited scale, concurrency, and performance.',
    tags: ['Data Warehouse', 'Cloud', 'Analytics', 'Big Data'],
    signals: [
      { id: 's21', type: 'Product', description: 'Announced Cortex AI features', date: '2023-11-01' },
      { id: 's22', type: 'Acquisition', description: 'Acquired Neeva', date: '2023-05-24' }
    ]
  },
  {
    id: '12',
    name: 'Ramp',
    domain: 'ramp.com',
    sector: 'Fintech',
    stage: 'Late Stage',
    location: 'New York, NY',
    founded: 2019,
    description: 'Ramp is the ultimate platform for modern finance teams. From corporate cards and expense management, to bill payments and accounting integrations.',
    tags: ['Corporate Cards', 'Expense Management', 'B2B', 'Finance'],
    signals: [
      { id: 's23', type: 'Funding', description: 'Raised $300M at $5.8B valuation', date: '2023-08-22' },
      { id: 's24', type: 'Product', description: 'Launched Ramp Plus', date: '2023-09-12' }
    ]
  },
  {
    id: '13',
    name: 'Scale AI',
    domain: 'scale.com',
    sector: 'AI/ML',
    stage: 'Late Stage',
    location: 'San Francisco, CA',
    founded: 2016,
    description: 'Scale accelerates the development of AI applications by helping machine learning teams generate high-quality ground truth data.',
    tags: ['Data Labeling', 'Generative AI', 'Enterprise AI'],
    signals: [
      { id: 's25', type: 'Product', description: 'Launched Scale GenAI Platform', date: '2023-05-10' },
      { id: 's26', type: 'Partnership', description: 'Expanded partnership with OpenAI', date: '2023-08-15' }
    ]
  },
  {
    id: '14',
    name: 'Hugging Face',
    domain: 'huggingface.co',
    sector: 'AI/ML',
    stage: 'Series D',
    location: 'New York, NY',
    founded: 2016,
    description: 'The AI community building the future. Build, train and deploy state of the art models powered by the reference open source in machine learning.',
    tags: ['Open Source', 'Machine Learning', 'Models', 'Community'],
    signals: [
      { id: 's27', type: 'Funding', description: 'Raised $235M Series D at $4.5B valuation', date: '2023-08-24' },
      { id: 's28', type: 'Partnership', description: 'Partnered with Google Cloud', date: '2023-05-18' }
    ]
  },
  {
    id: '15',
    name: 'Glean',
    domain: 'glean.com',
    sector: 'Enterprise Software',
    stage: 'Series D',
    location: 'Palo Alto, CA',
    founded: 2019,
    description: 'Glean is the AI-powered work assistant that connects across all your company\'s apps to help you find exactly what you need.',
    tags: ['Enterprise Search', 'Generative AI', 'Productivity'],
    signals: [
      { id: 's29', type: 'Funding', description: 'Raised $200M Series D at $2.2B valuation', date: '2024-02-27' },
      { id: 's30', type: 'Product', description: 'Launched Glean Chat', date: '2023-06-06' }
    ]
  }
];
