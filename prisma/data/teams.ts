import { TEAM_COLORS } from '../../src/domains/team/types/team.constants';

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
  },
  {
    code: 'BOS',
    name: 'Boston Celtics',
  },
  {
    code: 'BRK',
    name: 'Brooklyn Nets',
  },
  {
    code: 'CHI',
    name: 'Chicago Bulls',
  },
  {
    code: 'CHO',
    name: 'Charlotte Hornets',
  },
  {
    code: 'CLE',
    name: 'Cleveland Cavaliers',
  },
  {
    code: 'DAL',
    name: 'Dallas Mavericks',
  },
  {
    code: 'DEN',
    name: 'Denver Nuggets',
  },
  {
    code: 'DET',
    name: 'Detroit Pistons',
  },
  {
    code: 'GSW',
    name: 'Golden State Warriors',
  },
  {
    code: 'HOU',
    name: 'Houston Rockets',
  },
  {
    code: 'IND',
    name: 'Indiana Pacers',
  },
  {
    code: 'LAC',
    name: 'Los Angeles Clippers',
  },
  {
    code: 'LAL',
    name: 'Los Angeles Lakers',
  },
  {
    code: 'MEM',
    name: 'Memphis Grizzlies',
  },
  {
    code: 'MIA',
    name: 'Miami Heat',
  },
  {
    code: 'MIL',
    name: 'Milwaukee Bucks',
  },
  {
    code: 'MIN',
    name: 'Minnesota Timberwolves',
  },
  {
    code: 'NOP',
    name: 'New Orleans Pelicans',
  },
  {
    code: 'NYK',
    name: 'New York Knicks',
  },
  {
    code: 'OKC',
    name: 'Oklahoma City Thunder',
  },
  {
    code: 'ORL',
    name: 'Orlando Magic',
  },
  {
    code: 'PHI',
    name: 'Philadelphia 76ers',
  },
  {
    code: 'PHO',
    name: 'Phoenix Suns',
  },
  {
    code: 'POR',
    name: 'Portland Trail Blazers',
  },
  {
    code: 'SAC',
    name: 'Sacramento Kings',
  },
  {
    code: 'SAS',
    name: 'San Antonio Spurs',
  },
  {
    code: 'TOR',
    name: 'Toronto Raptors',
  },
  {
    code: 'UTA',
    name: 'Utah Jazz',
  },
  {
    code: 'WAS',
    name: 'Washington Wizards',
  },
].map((team) => ({
  ...team,
  ...TEAM_COLORS[team.code],
  includedNames: includedNamesByCode[team.code] ?? [],
}));

export function validateTeamCodes(codes: Iterable<string>): void {
  const known = new Set(teams.map((team) => team.code));
  const unknown = [...new Set(codes)].filter((code) => !known.has(code));
  if (unknown.length) {
    throw new Error(`Unknown normalized team codes: ${unknown.join(', ')}`);
  }
}
