'use client';

import { useTranslations } from 'next-intl';
import { TEAM_LOGOS } from '@/core/constants/TeamLogos';
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
  onSelect: (code: string | null) => void;
}

export const TeamSelection = ({
  selectedTeam,
  onSelect,
}: TeamSelectionProps): React.JSX.Element => {
  const t = useTranslations('profile');

  return (
    <ul className={styles.list}>
      <li className={styles.none}>
        <Button
          type="button"
          className={styles.team}
          variant={selectedTeam === null ? 'primary' : 'ghost'}
          aria-pressed={selectedTeam === null}
          onClick={() => onSelect(null)}
        >
          {t('none')}
        </Button>
      </li>
      {TEAM_CODES.map((code) => {
        const TeamLogo = TEAM_LOGOS[code];

        return (
          <li key={code}>
            <Button
              type="button"
              size="sm"
              className={styles.team}
              textProps={{ className: styles.content }}
              variant={selectedTeam === code ? 'primary' : 'ghost'}
              aria-pressed={selectedTeam === code}
              onClick={() => onSelect(code)}
            >
              <span className={styles.logo} aria-hidden="true">
                {TeamLogo && <TeamLogo size={48} />}
              </span>
              <span>{code}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
