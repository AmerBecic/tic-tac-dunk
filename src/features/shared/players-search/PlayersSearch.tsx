'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'use-debounce';
import { useGetPlayers } from '@/domains/player/hooks/useGetPlayers';
import type { Player } from '@/domains/player/types/player.types';
import { Button } from '../ui/button';
import { SearchInput } from '../ui/search-input';
import { Text } from '../ui/text';
import styles from './PlayersSearch.module.scss';

interface PlayersSearchProps {
  disabled?: boolean;
  onSelectPlayer?: (player: Player) => void;
}

export const PlayersSearch = ({
  onSelectPlayer,
  disabled = false,
}: PlayersSearchProps): React.JSX.Element => {
  const t = useTranslations('playersSearch');
  const [searchPlayers, setSearchPlayers] = useState('');
  const [debouncedSearchName] = useDebounce(searchPlayers, 400);
  const resultsId = useId();
  const { players, isLoading } = useGetPlayers({
    search: debouncedSearchName,
    page: 1,
    limit: 100,
  });
  const pending = searchPlayers !== debouncedSearchName || isLoading;
  const hasSearch = searchPlayers.trim().length > 0;

  return (
    <div className={styles.search}>
      <SearchInput
        disabled={disabled}
        className={styles.searchInput}
        containerClassName={styles.searchField}
        value={searchPlayers}
        onChange={setSearchPlayers}
        autoComplete="off"
        placeholder={t('search')}
        clearLabel={t('clear')}
        aria-label={t('searchLabel')}
        aria-controls={hasSearch ? resultsId : undefined}
      />
      {hasSearch && (
        <div id={resultsId} className={styles.results} aria-busy={pending}>
          {pending ? null : players.length === 0 ? (
            <Text as="p" className={styles.message} role="status">
              {t('empty')}
            </Text>
          ) : (
            <ul className={styles.list} aria-label={t('resultsLabel')}>
              {players.map((player) => (
                <li key={player.id}>
                  <Button
                    type="button"
                    disabled={disabled}
                    variant="ghost"
                    className={styles.player}
                    textProps={{ className: styles.playerLabel, bold: false }}
                    onClick={() => onSelectPlayer?.(player)}
                  >
                    <Text className={styles.name} textAlign="left">
                      {player.name}
                    </Text>
                    <Text className={styles.seasons} textAlign="right">
                      {player.first_season} - {player.last_season}
                    </Text>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
