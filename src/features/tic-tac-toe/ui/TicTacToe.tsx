'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useCreateTicTacToeMatch } from '@/domains/tic-tac-toe/hooks/useCreateTicTacToeMatch';
import { DEFAULT_TURN_DURATION_SECONDS } from '@/domains/tic-tac-toe/types/tic-tac-toe.constants';
import { Button } from '@/features/shared/ui/button';
import { Paragraph } from '@/features/shared/ui/paragraph';
import { AiMatch } from './ai-match/AiMatch';
import { HOME_URL } from '@/core/constants/Routes';
import { useRouter } from '@/core/i18n/navigation';
import styles from './TicTacToe.module.scss';

export const TicTacToe = () => {
  const t = useTranslations('ticTacToe');
  const router = useRouter();
  const { createTicTacToeMatch, data, isPending } = useCreateTicTacToeMatch();
  const started = useRef(false);
  const startMatch = useCallback(
    () =>
      createTicTacToeMatch({
        mode: 'AI',
        turnDurationSeconds: DEFAULT_TURN_DURATION_SECONDS,
      }).catch(() => {}),
    [createTicTacToeMatch]
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void startMatch();
  }, [startMatch]);

  const actions = (
    <div className={styles.actions}>
      <Button
        type="button"
        size="lg"
        variant="secondary"
        className={styles.newGame}
        textProps={{ className: styles.label }}
        disabled={isPending}
        onClick={() => void startMatch()}
      >
        {t('newGame')}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="danger"
        className={styles.leave}
        textProps={{ className: styles.label }}
        onClick={() => router.push(HOME_URL)}
      >
        {t('leave')}
      </Button>
    </div>
  );

  if (!data || isPending)
    return (
      <div className={styles.fallback}>
        <Paragraph role="status">{t('creatingMatch')}</Paragraph>
      </div>
    );
  return <AiMatch key={data.id} initialMatch={data} actions={actions} />;
};
