import { Button } from '@/features/shared/ui/button';
import styles from './TeamSelection.module.scss';

const TEAM_CODES = [
  'ATL',
  'BOS',
  'BRK',
  'CHI',
  'CHO',
  'CLE',
  'DAL',
  'DEN',
  'DET',
  'GSW',
  'HOU',
  'IND',
  'LAC',
  'LAL',
  'MEM',
  'MIA',
  'MIL',
  'MIN',
  'NOP',
  'NYK',
  'OKC',
  'ORL',
  'PHI',
  'PHO',
  'POR',
  'SAC',
  'SAS',
  'TOR',
  'UTA',
  'WAS',
] as const;

interface TeamSelectionProps {
  selectedTeam: string | null;
  onSelect: (code: string) => void;
}

export const TeamSelection = ({
  selectedTeam,
  onSelect,
}: TeamSelectionProps): React.JSX.Element => (
  <ul className={styles.list}>
    {TEAM_CODES.map((code) => (
      <li key={code}>
        <Button
          type="button"
          size="sm"
          variant={selectedTeam === code ? 'primary' : 'ghost'}
          aria-pressed={selectedTeam === code}
          onClick={() => onSelect(code)}
        >
          {code}
        </Button>
      </li>
    ))}
  </ul>
);
