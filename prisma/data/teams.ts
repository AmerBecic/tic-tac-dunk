const includedNamesByCode: Record<string, string[]> = {
  ATL: ['Milwaukee Hawks', 'St. Louis Hawks', 'Tri-Cities Blackhawks'],
  BRK: ['New Jersey Nets', 'New York Nets'],
  CHO: ['Charlotte Hornets (original)', 'Charlotte Bobcats'],
  DEN: ['Denver Nuggets (DNN)'],
  DET: ['Fort Wayne Pistons'],
  GSW: ['Philadelphia Warriors', 'San Francisco Warriors'],
  HOU: ['San Diego Rockets'],
  LAC: ['Buffalo Braves', 'San Diego Clippers'],
  LAL: ['Minneapolis Lakers'],
  MEM: ['Vancouver Grizzlies'],
  NOP: ['New Orleans Hornets', 'New Orleans/Oklahoma City Hornets'],
  OKC: ['Seattle SuperSonics'],
  PHI: ['Syracuse Nationals'],
  SAC: [
    'Kansas City Kings',
    'Kansas City-Omaha Kings',
    'Cincinnati Royals',
    'Rochester Royals',
  ],
  UTA: ['New Orleans Jazz'],
  WAS: [
    'Baltimore Bullets',
    'Chicago Packers',
    'Chicago Zephyrs',
    'Washington Bullets',
    'Capital Bullets',
  ],
};

export const teams = [
  {
    code: 'ATL',
    name: 'Atlanta Hawks',
    primaryColor: '#E03A3E',
    secondaryColor: '#FDB927',
  },
  {
    code: 'BOS',
    name: 'Boston Celtics',
    primaryColor: '#007A33',
    secondaryColor: '#BA9653',
  },
  {
    code: 'BRK',
    name: 'Brooklyn Nets',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  {
    code: 'CHI',
    name: 'Chicago Bulls',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
  },
  {
    code: 'CHO',
    name: 'Charlotte Hornets',
    primaryColor: '#1D1160',
    secondaryColor: '#00788C',
  },
  {
    code: 'CLE',
    name: 'Cleveland Cavaliers',
    primaryColor: '#860038',
    secondaryColor: '#FDBB30',
  },
  {
    code: 'DAL',
    name: 'Dallas Mavericks',
    primaryColor: '#00538C',
    secondaryColor: '#002B5E',
  },
  {
    code: 'DEN',
    name: 'Denver Nuggets',
    primaryColor: '#0E2240',
    secondaryColor: '#FEC524',
  },
  {
    code: 'DET',
    name: 'Detroit Pistons',
    primaryColor: '#C8102E',
    secondaryColor: '#1D42BA',
  },
  {
    code: 'GSW',
    name: 'Golden State Warriors',
    primaryColor: '#1D428A',
    secondaryColor: '#FFC72C',
  },
  {
    code: 'HOU',
    name: 'Houston Rockets',
    primaryColor: '#CE1141',
    secondaryColor: '#FFC72C',
  },
  {
    code: 'IND',
    name: 'Indiana Pacers',
    primaryColor: '#002D62',
    secondaryColor: '#FDBB30',
  },
  {
    code: 'LAC',
    name: 'Los Angeles Clippers',
    primaryColor: '#0C2340',
    secondaryColor: '#C8102E',
  },
  {
    code: 'LAL',
    name: 'Los Angeles Lakers',
    primaryColor: '#552583',
    secondaryColor: '#FDB927',
  },
  {
    code: 'MEM',
    name: 'Memphis Grizzlies',
    primaryColor: '#5D76A9',
    secondaryColor: '#12173F',
  },
  {
    code: 'MIA',
    name: 'Miami Heat',
    primaryColor: '#98002E',
    secondaryColor: '#000000',
  },
  {
    code: 'MIL',
    name: 'Milwaukee Bucks',
    primaryColor: '#00471B',
    secondaryColor: '#EEE1C6',
  },
  {
    code: 'MIN',
    name: 'Minnesota Timberwolves',
    primaryColor: '#1D428A',
    secondaryColor: '#009A44',
  },
  {
    code: 'NOP',
    name: 'New Orleans Pelicans',
    primaryColor: '#0C2340',
    secondaryColor: '#85714D',
  },
  {
    code: 'NYK',
    name: 'New York Knicks',
    primaryColor: '#006BB6',
    secondaryColor: '#F58426',
  },
  {
    code: 'OKC',
    name: 'Oklahoma City Thunder',
    primaryColor: '#007AC1',
    secondaryColor: '#EF3B24',
  },
  {
    code: 'ORL',
    name: 'Orlando Magic',
    primaryColor: '#0077C0',
    secondaryColor: '#000000',
  },
  {
    code: 'PHI',
    name: 'Philadelphia 76ers',
    primaryColor: '#006BB6',
    secondaryColor: '#ED174C',
  },
  {
    code: 'PHO',
    name: 'Phoenix Suns',
    primaryColor: '#1D1160',
    secondaryColor: '#E56020',
  },
  {
    code: 'POR',
    name: 'Portland Trail Blazers',
    primaryColor: '#E03A3E',
    secondaryColor: '#000000',
  },
  {
    code: 'SAC',
    name: 'Sacramento Kings',
    primaryColor: '#5A2D81',
    secondaryColor: '#000000',
  },
  {
    code: 'SAS',
    name: 'San Antonio Spurs',
    primaryColor: '#000000',
    secondaryColor: '#C4CED4',
  },
  {
    code: 'TOR',
    name: 'Toronto Raptors',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
  },
  {
    code: 'UTA',
    name: 'Utah Jazz',
    primaryColor: '#5B2B82',
    secondaryColor: '#000000',
  },
  {
    code: 'WAS',
    name: 'Washington Wizards',
    primaryColor: '#002B5C',
    secondaryColor: '#E31837',
  },
].map((team) => ({
  ...team,
  includedNames: includedNamesByCode[team.code] ?? [],
}));

export function validateTeamCodes(codes: Iterable<string>): void {
  const known = new Set(teams.map((team) => team.code));
  const unknown = [...new Set(codes)].filter((code) => !known.has(code));
  if (unknown.length) {
    throw new Error(`Unknown normalized team codes: ${unknown.join(', ')}`);
  }
}
