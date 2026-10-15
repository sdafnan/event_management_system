/**
 * Ticketmaster Discovery API Service
 * Handles live API queries with automatic fallback to rich sample dataset
 * Supports environment variable (VITE_TICKETMASTER_API_KEY) and localStorage custom key.
 */

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_STORAGE_KEY = 'eventsphere_tm_api_key';

// Sample curated mock events matching Ticketmaster Discovery API v2 schema
export const MOCK_EVENTS = [
  {
    id: 'tm-event-001',
    name: 'Coldplay: Music of the Spheres World Tour 2026',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675,
        fallback: false
      },
      {
        ratio: '3_2',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
        width: 800,
        height: 533,
        fallback: false
      }
    ],
    sales: {
      public: {
        startDateTime: '2026-01-10T15:00:00Z',
        endDateTime: '2026-11-20T23:59:00Z'
      }
    },
    dates: {
      start: {
        localDate: '2026-11-20',
        localTime: '19:30:00',
        dateTime: '2026-11-20T19:30:00Z'
      },
      timezone: 'America/New_York',
      status: {
        code: 'onsale'
      }
    },
    classifications: [
      {
        segment: { id: 'KZFzniwnSyZfZnhtJ1', name: 'Music' },
        genre: { id: 'KnvZfZ7vAvv', name: 'Alternative Rock' },
        subGenre: { id: 'KZazBEksamaZfZnhn1', name: 'Pop' }
      }
    ],
    promoter: {
      id: '653',
      name: 'LIVE NATION',
      description: 'Live Nation Global Concerts'
    },
    info: 'Experience Coldplay live with stunning sustainable LED wristbands, kinetic dance floors, and breathtaking audio-visual spectacles performing their greatest hits.',
    pleaseNote: 'All ages admitted. Floor section is standing room only. Arrive 1 hour early for security screening.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 65.0,
        max: 295.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'KovZpZA1AJ6A',
          name: 'MetLife Stadium',
          type: 'venue',
          postalCode: '07073',
          city: { name: 'East Rutherford / New York' },
          state: { name: 'New Jersey', stateCode: 'NJ' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '1 MetLife Stadium Dr' },
          location: { longitude: '-74.0744', latitude: '40.8136' },
          boxOfficeInfo: { openHoursDetail: 'Mon-Sat 10am-6pm' }
        }
      ]
    }
  },
  {
    id: 'tm-event-002',
    name: 'NBA Finals 2026: Eastern Showcase',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-05',
        localTime: '20:00:00',
        dateTime: '2026-12-05T20:00:00Z'
      },
      timezone: 'America/New_York',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Sports' },
        genre: { name: 'Basketball' },
        subGenre: { name: 'NBA' }
      }
    ],
    info: 'Premier basketball matchup featuring conference powerhouses battling for championship playoff seeding.',
    pleaseNote: 'Bags larger than 14x14x6 inches are strictly prohibited. Digital mobile ticketing only.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 120.0,
        max: 850.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-msg-01',
          name: 'Madison Square Garden',
          city: { name: 'New York' },
          state: { name: 'New York', stateCode: 'NY' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '4 Pennsylvania Plaza' }
        }
      ]
    }
  },
  {
    id: 'tm-event-003',
    name: 'Hamilton: The Broadway Musical Spectacular',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-11-28',
        localTime: '19:00:00',
        dateTime: '2026-11-28T19:00:00Z'
      },
      timezone: 'America/New_York',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Arts & Theatre' },
        genre: { name: 'Theatre' },
        subGenre: { name: 'Musical' }
      }
    ],
    info: "Lin-Manuel Miranda's Pulitzer Prize-winning masterpiece fusing hip-hop, jazz, R&B, and Broadway theatre.",
    pleaseNote: 'Recommended for ages 10 and up. Run time is 2 hours and 45 minutes including one intermission.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 99.0,
        max: 349.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-broadway-02',
          name: 'Richard Rodgers Theatre',
          city: { name: 'New York' },
          state: { name: 'New York', stateCode: 'NY' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '226 W 46th St' }
        }
      ]
    }
  },
  {
    id: 'tm-event-004',
    name: 'Hans Zimmer Live: The Symphonic Journey',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-12',
        localTime: '20:00:00',
        dateTime: '2026-12-12T20:00:00Z'
      },
      timezone: 'America/Los_Angeles',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Music' },
        genre: { name: 'Classical / Film Score' },
        subGenre: { name: 'Symphonic' }
      }
    ],
    info: 'A 60-piece orchestra performing epic suites from Interstellar, Inception, Gladiator, Dune, and The Dark Knight.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 75.0,
        max: 275.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-crypto-03',
          name: 'Crypto.com Arena',
          city: { name: 'Los Angeles' },
          state: { name: 'California', stateCode: 'CA' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '1111 S Figueroa St' }
        }
      ]
    }
  },
  {
    id: 'tm-event-005',
    name: 'International Indie Cinema & VR Showcase',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-11-18',
        localTime: '14:00:00',
        dateTime: '2026-11-18T14:00:00Z'
      },
      timezone: 'America/Los_Angeles',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Film' },
        genre: { name: 'Festival' },
        subGenre: { name: 'Independent Film' }
      }
    ],
    info: 'Cutting-edge independent films, VR storytelling installations, and panel talks with acclaimed directors.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 35.0,
        max: 110.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-chinese-04',
          name: 'TCL Chinese Theatre',
          city: { name: 'Los Angeles' },
          state: { name: 'California', stateCode: 'CA' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '6925 Hollywood Blvd' }
        }
      ]
    }
  },
  {
    id: 'tm-event-006',
    name: 'Premier League: Arsenal vs Manchester City',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-18',
        localTime: '16:30:00',
        dateTime: '2026-12-18T16:30:00Z'
      },
      timezone: 'Europe/London',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Sports' },
        genre: { name: 'Soccer' },
        subGenre: { name: 'Premier League' }
      }
    ],
    info: 'Crucial title showdown between two European titans under the iconic London stadium lights.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'GBP',
        min: 80.0,
        max: 320.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-emirates-05',
          name: 'Emirates Stadium',
          city: { name: 'London' },
          country: { name: 'United Kingdom', countryCode: 'GB' },
          address: { line1: 'Hornsey Rd' }
        }
      ]
    }
  },
  {
    id: 'tm-event-007',
    name: 'Electric Neon Dreams Music & Arts Festival',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-30',
        localTime: '18:00:00',
        dateTime: '2026-12-30T18:00:00Z'
      },
      timezone: 'America/Los_Angeles',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Music' },
        genre: { name: 'Electronic' },
        subGenre: { name: 'Festival' }
      }
    ],
    info: 'A 2-day immersive electronic festival featuring top global DJs, laser shows, interactive art, and food vendors.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 150.0,
        max: 450.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-lv-strip-06',
          name: 'Las Vegas Festival Grounds',
          city: { name: 'Las Vegas' },
          state: { name: 'Nevada', stateCode: 'NV' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '311 W Sahara Ave' }
        }
      ]
    }
  },
  {
    id: 'tm-event-008',
    name: 'Tech & AI Innovators Global Summit 2026',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-11-25',
        localTime: '09:00:00',
        dateTime: '2026-11-25T09:00:00Z'
      },
      timezone: 'America/Chicago',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Miscellaneous' },
        genre: { name: 'Conference' },
        subGenre: { name: 'Technology' }
      }
    ],
    info: 'World-renowned summit convening tech leaders, researchers, and creators discussing agentic AI, robotics, and future web systems.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 199.0,
        max: 599.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-mccormick-07',
          name: 'McCormick Place Convention Center',
          city: { name: 'Chicago' },
          state: { name: 'Illinois', stateCode: 'IL' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '2301 S King Dr' }
        }
      ]
    }
  },
  {
    id: 'tm-event-009',
    name: 'Taylor Swift: The Eras Tour (Special Encore)',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-24',
        localTime: '19:00:00',
        dateTime: '2026-12-24T19:00:00Z'
      },
      timezone: 'America/Los_Angeles',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Music' },
        genre: { name: 'Pop' },
        subGenre: { name: 'Concert' }
      }
    ],
    info: 'Special holiday stadium concert celebrating musical eras spanning over two decades of chart-topping anthems.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 89.0,
        max: 420.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-sofi-08',
          name: 'SoFi Stadium',
          city: { name: 'Los Angeles' },
          state: { name: 'California', stateCode: 'CA' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '1001 Stadium Dr, Inglewood' }
        }
      ]
    }
  },
  {
    id: 'tm-event-010',
    name: 'The Lion King: London West End Production',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-11-22',
        localTime: '19:30:00',
        dateTime: '2026-11-22T19:30:00Z'
      },
      timezone: 'Europe/London',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Arts & Theatre' },
        genre: { name: 'Theatre' },
        subGenre: { name: 'Musical' }
      }
    ],
    info: 'Set against the majesty of the Serengeti Plains, Disneys multi-award winning musical brings brilliant puppetry and evocative music alive.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'GBP',
        min: 45.0,
        max: 185.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-lyceum-09',
          name: 'Lyceum Theatre',
          city: { name: 'London' },
          country: { name: 'United Kingdom', countryCode: 'GB' },
          address: { line1: '21 Wellington St, Covent Garden' }
        }
      ]
    }
  },
  {
    id: 'tm-event-011',
    name: 'Cirque du Soleil: Echoes of Eternity',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-08',
        localTime: '19:30:00',
        dateTime: '2026-12-08T19:30:00Z'
      },
      timezone: 'America/New_York',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Arts & Theatre' },
        genre: { name: 'Circus' },
        subGenre: { name: 'Performance Art' }
      }
    ],
    info: 'Astonishing acrobatics, poetic visuals, and surreal stage mechanics in a visionary production exploring human connection with the cosmos.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 60.0,
        max: 220.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-bell-centre-10',
          name: 'Scotiabank Arena',
          city: { name: 'Toronto' },
          state: { name: 'Ontario', stateCode: 'ON' },
          country: { name: 'Canada', countryCode: 'CA' },
          address: { line1: '40 Bay St' }
        }
      ]
    }
  },
  {
    id: 'tm-event-012',
    name: 'Formula 1: Grand Prix Showcase',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    locale: 'en-us',
    images: [
      {
        ratio: '16_9',
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      start: {
        localDate: '2026-12-28',
        localTime: '15:00:00',
        dateTime: '2026-12-28T15:00:00Z'
      },
      timezone: 'America/Chicago',
      status: { code: 'onsale' }
    },
    classifications: [
      {
        segment: { name: 'Sports' },
        genre: { name: 'Motorsports / Racing' },
        subGenre: { name: 'Formula 1' }
      }
    ],
    info: 'High-octane motorsport exhibition featuring iconic teams, paddock club hospitality, and full-speed track displays.',
    priceRanges: [
      {
        type: 'standard',
        currency: 'USD',
        min: 140.0,
        max: 950.0
      }
    ],
    _embedded: {
      venues: [
        {
          id: 'ven-cota-11',
          name: 'Circuit of The Americas',
          city: { name: 'Austin' },
          state: { name: 'Texas', stateCode: 'TX' },
          country: { name: 'United States Of America', countryCode: 'US' },
          address: { line1: '9201 Circuit of the Americas Blvd' }
        }
      ]
    }
  }
];

// Helper to retrieve active API key
export const getActiveApiKey = () => {
  const customKey = localStorage.getItem(API_STORAGE_KEY);
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return import.meta.env.VITE_TICKETMASTER_API_KEY || '';
};

export const saveCustomApiKey = (key) => {
  if (key && key.trim().length > 0) {
    localStorage.setItem(API_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_STORAGE_KEY);
  }
};

/**
 * Filter mock events according to parameters
 */
const filterMockEvents = ({ keyword, classificationName, city, sort, page = 0, size = 12 }) => {
  let list = [...MOCK_EVENTS];

  if (keyword && keyword.trim().length > 0) {
    const kw = keyword.toLowerCase().trim();
    list = list.filter((e) =>
      e.name.toLowerCase().includes(kw) ||
      (e.info && e.info.toLowerCase().includes(kw)) ||
      (e._embedded?.venues?.[0]?.name && e._embedded.venues[0].name.toLowerCase().includes(kw)) ||
      (e._embedded?.venues?.[0]?.city?.name && e._embedded.venues[0].city.name.toLowerCase().includes(kw))
    );
  }

  if (classificationName && classificationName !== 'All' && classificationName !== '') {
    const cat = classificationName.toLowerCase();
    list = list.filter((e) => {
      const seg = e.classifications?.[0]?.segment?.name?.toLowerCase() || '';
      const genre = e.classifications?.[0]?.genre?.name?.toLowerCase() || '';
      return seg.includes(cat) || cat.includes(seg) || genre.includes(cat);
    });
  }

  if (city && city !== 'All' && city !== '') {
    const targetCity = city.toLowerCase();
    list = list.filter((e) => {
      const c = e._embedded?.venues?.[0]?.city?.name?.toLowerCase() || '';
      return c.includes(targetCity);
    });
  }

  // Sorting
  if (sort === 'date,asc') {
    list.sort((a, b) => new Date(a.dates?.start?.localDate || 0) - new Date(b.dates?.start?.localDate || 0));
  } else if (sort === 'date,desc') {
    list.sort((a, b) => new Date(b.dates?.start?.localDate || 0) - new Date(a.dates?.start?.localDate || 0));
  } else if (sort === 'name,asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const startIndex = page * size;
  const pagedList = list.slice(startIndex, startIndex + size);

  return {
    events: pagedList,
    page: {
      size,
      totalElements,
      totalPages,
      number: page
    },
    isLiveApi: false
  };
};

/**
 * Fetch events from Ticketmaster Discovery API (or fallback)
 */
export const fetchEventsApi = async ({
  keyword = '',
  classificationName = '',
  city = '',
  sort = 'date,asc',
  page = 0,
  size = 12
}) => {
  const apiKey = getActiveApiKey();

  if (!apiKey) {
    return filterMockEvents({ keyword, classificationName, city, sort, page, size });
  }

  const queryParams = new URLSearchParams({
    apikey: apiKey,
    size: String(size),
    page: String(page),
    sort: sort.includes(',') ? sort : `${sort},asc`
  });

  if (keyword && keyword.trim()) {
    queryParams.append('keyword', keyword.trim());
  }

  if (classificationName && classificationName !== 'All') {
    queryParams.append('classificationName', classificationName);
  }

  if (city && city !== 'All') {
    queryParams.append('city', city);
  }

  try {
    const res = await fetch(`${BASE_URL}/events.json?${queryParams.toString()}`);
    
    if (!res.ok) {
      console.warn(`Ticketmaster API returned status ${res.status}. Falling back to sample events.`);
      return filterMockEvents({ keyword, classificationName, city, sort, page, size });
    }

    const data = await res.json();
    const events = data._embedded?.events || [];
    const pageInfo = data.page || {
      size,
      totalElements: events.length,
      totalPages: Math.ceil(events.length / size) || 1,
      number: page
    };

    return {
      events,
      page: pageInfo,
      isLiveApi: true
    };
  } catch (err) {
    console.warn('Network error accessing Ticketmaster API, using fallback data:', err);
    return filterMockEvents({ keyword, classificationName, city, sort, page, size });
  }
};

/**
 * Fetch single event details by ID
 */
export const fetchEventDetailsApi = async (eventId) => {
  const apiKey = getActiveApiKey();

  // Check if it matches a mock event ID or if no API key
  const mockMatch = MOCK_EVENTS.find((e) => e.id === eventId);
  if (!apiKey || mockMatch) {
    if (mockMatch) return { event: mockMatch, isLiveApi: false };
  }

  try {
    const res = await fetch(`${BASE_URL}/events/${eventId}.json?apikey=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      return { event: data, isLiveApi: true };
    }
  } catch (err) {
    console.warn(`Error fetching event ${eventId} from Ticketmaster:`, err);
  }

  // Final fallback to mock event if found, or first event
  return {
    event: mockMatch || MOCK_EVENTS[0],
    isLiveApi: false
  };
};
