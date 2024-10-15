export interface YearData {
  year: number;
  items: Array<{
    emoji: string;
    title: string;
    description: string;
  }>;
}

export const timelineData: YearData[] = [
  {
    year: 2024,
    items: [
      {
        emoji: '🇧🇪',
        title: 'Spoke at FOSDEM',
        description: `I spoke about Wagtail in a room full of other open source CMS developers. It was the first time I've been to FOSDEM.`,
      },
    ],
  },
  {
    year: 2023,
    items: [
      {
        emoji: '🇨🇦',
        title: 'Went on a road trip in Canada',
        description: `We went on a road trip from Calgary to Edmonton, through Banff and Jasper. We saw a baby bear!`,
      },
      {
        emoji: '🇺🇸',
        title: 'Spoke at DjangoCon US',
        description: `I spoke about Wagtail's modern editing experience for existing Django models. It's the first time I've been to DjangoCon US.`,
      },
      {
        emoji: '☀️',
        title: 'Represented Wagtail at the Google Summer of Code Mentor Summit',
        description: `Thibaud and I went to the Google Summer of Code Mentor Summit in California. It was my first time in the US and we went on a road trip from Los Angeles to San Francisco!`,
      },
      {
        emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        title: 'Completed the Black Dragon Challenge',
        description: `Went on a ~32km hike in the Brecon Beacons, Wales. It was my first real hike and it was tough, but the views were worth it!`,
      },
      {
        emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        title: 'Held a workshop at DjangoCon Europe',
        description: `With my colleague Thibaud, we did a workshop on using Wagtail with Next.js. There were more than 50 participants, which we did not expect at all!`,
      },
      {
        emoji: '🇫🇷',
        title: 'Went on my first ski trip',
        description: `Tried skiing for the first time in Chamonix, France. I don't think I quite enjoyed it, but hey – at least I tried.`,
      },
    ],
  },
  {
    year: 2022,
    items: [
      {
        emoji: '🇸🇪',
        title: `Visited the Swedish Lapland`,
        description: `I went on a trip to Luleå in the Swedish Lapland with my friend. We didn't get to see the northern lights, though. The dog sledding was quite fun!`,
      },
      {
        emoji: '♿️',
        title: `Mentored Wagtail's Outreachy program`,
        description:
          'I co-mentored an Outreachy intern who worked on adding an accessibility checker to Wagtail. It was a great success!',
      },
      {
        emoji: '🐦',
        title: 'Joined the Wagtail Core Team',
        description:
          'After contributing major features to Wagtail, I was invited to join the core team.',
      },
      {
        emoji: '🇵🇹',
        title: 'Spoke at DjangoCon Europe',
        description: `Third time's the charm! DjangoCon Europe 2022 was finally held on-site in Porto, Portugal. I gave a talk about my experiment with file-based routing in Django. I also met my awesome Google Summer of Code mentors for the first time.`,
      },
      {
        emoji: '🇬🇧',
        title: 'Moved to Bristol, UK',
        description: `Big move! It's the first time I live on my own. Abroad, too!`,
      },
      {
        emoji: '🔥',
        title: 'Joined Torchbox',
        description: 'Started working on Wagtail CMS and its ecosystem.',
      },
    ],
  },
  {
    year: 2021,
    items: [
      {
        emoji: '🏢',
        title: 'Joined GudangAda',
        description: 'My first full-time job as a Software Engineer.',
      },
      {
        emoji: '🎓',
        title: 'Graduated from University',
        description: `It was a very exhausting journey and I'm really grateful I made it.`,
      },
    ],
  },
  {
    year: 2020,
    items: [
      {
        emoji: '🗣️',
        title: 'Spoke at DjangoCon Europe',
        description:
          'Presented my talk titled "Implementing a Cross-DB JSONField".',
      },
      {
        emoji: '🐍',
        title: 'Part-Time at VIPERdev',
        description:
          'I worked on a Django+Angular project that integrates Slack, Stripe, and AI services.',
      },
      {
        emoji: '🐍',
        title: 'Internship at VIPERdev',
        description:
          'I learned more about Django and Angular while working on different projects. I also set up CI/CD on GitLab for some of the projects.',
      },
      {
        emoji: '🗣️',
        title: 'Talked at DjangoChat',
        description:
          'Discussed my Google Summer of Code experience in an episode of DjangoChat, a weekly podcast on the Django Web Framework.',
      },
      {
        emoji: '🕸️',
        title: 'Web Developer at Fasilkom UI',
        description:
          'Maintained a room reservation system by upgrading the stack, optimizing database queries, fixing bugs and vulnerabilities, as well as adding new features.',
      },
    ],
  },
  {
    year: 2019,
    items: [
      {
        emoji: '☀️',
        title: 'Google Summer of Code with Django',
        description:
          'Implemented the cross-DB JSONField feature which became part of the Django 3.1 release.',
      },
      {
        emoji: '💻',
        title: 'Led DSC Universitas Indonesia',
        description:
          'Led the Universitas Indonesia chapter of Developer Student Clubs, a program run by Google Developers. I worked with five core team members to build a new community of 270+ students.',
      },
    ],
  },
  {
    year: 2018,
    items: [
      {
        emoji: '🧩',
        title: 'Internship at Wikimedia Indonesia',
        description:
          'Helped setting up a local server to host applications internally.',
      },
      {
        emoji: '👨‍🏫',
        title: 'Started as a Teaching Assistant at Fasilkom UI',
        description:
          'Tutored students, designed problem sets, and graded assignments in four different courses.',
      },
    ],
  },
  {
    year: 2017,
    items: [
      {
        emoji: '🏫',
        title: 'Started at Universitas Indonesia',
        description:
          'I considered studying English Literature or Visual Design. However, I already had experience in programming, so I decided to pursue Computer Science further.',
      },
      {
        emoji: '🎒',
        title: 'Graduated High School',
        description:
          'I found amazing friends in high school whom I still keep in touch with.',
      },
    ],
  },
  {
    year: 2016,
    items: [
      {
        emoji: '🏆',
        title: 'Won the Grand Prize of Besut Kode',
        description:
          'Besut Kode was an open source software development competition for high school students held by Wikimedia Indonesia. This competition introduced me to the world of open-source software. I became friends with some highly-skilled students from this competition.',
      },
      {
        emoji: '📝',
        title: 'National Science Olympiad in Informatics',
        description:
          'Even though I only became a provincial-level finalist, the olympiad made me learn more about discrete mathematics and basic competitive programming skills.',
      },
    ],
  },
  {
    year: 2013,
    items: [
      {
        emoji: '👨‍💻',
        title: 'Learned HTML and CSS',
        description:
          'I completed the HTML and CSS course on Codecademy, but I gave up learning JavaScript because it was too much for my brain to comprehend.',
      },
    ],
  },
  {
    year: 2012,
    items: [
      {
        emoji: '👨‍💻',
        title: 'Hello World',
        description: `My sister had just started her Computer Science study and I was curious enough to borrow her book. I wrote a Hello World program and a basic input/output program with Java Swing. I didn't learn Java again until six years later.`,
      },
    ],
  },
  {
    year: 2011,
    items: [
      {
        emoji: '📱',
        title: 'Modded my cell phone',
        description: `Smartphones were very expensive and weren't as common as they are now. So, I learned how to mod my Sony Ericsson feature phone and changed the font, icons, layout, etc. For some reason, XML made sense to my twelve-year-old self back then. I also learned how to patch my phone's firmware to add new features and enable it to run ELF executables. I played around with IDA even though I didn't have a single idea about assembly instructions. Fun stuff.`,
      },
    ],
  },
  {
    year: 1999,
    items: [
      {
        emoji: '👶',
        title: 'Born',
        description: 'Hello, world!',
      },
    ],
  },
];
