'use client';

import { useTranslations } from 'next-intl';
import { DialogContent } from '@/features/shared/ui/dialog';
import {
  DAILY_PUZZLE_URL,
  DAILY_PUZZLE_LIST_URL,
  TIC_TAC_TOE_AI_URL,
} from '@/core/constants/Routes';
import { useRouter } from '@/core/i18n/navigation';
import { GamemodeCard } from '@/features/shared/gamemode-card';
import PreviousSvg from '@/assets/Previous.svg';
import PuzzleSvg from '@/assets/Puzzle.svg';
import BotSvg from '@/assets/Bot.svg';
import PvPSvg from '@/assets/PvP.svg';
import styles from './GamemodeSelection.module.scss';
export const GamemodeSelection = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <DialogContent className={styles.dialog} closeLabel={t('common.close')}>
      <div className={styles.grid}>
        <GamemodeCard
          icon={<PreviousSvg aria-hidden="true" focusable="false" />}
          title={t('home.gamemodeSelection.previousTitle')}
          description={t('home.gamemodeSelection.previousDescription')}
          onPlay={() => router.push(DAILY_PUZZLE_LIST_URL)}
        />
        <GamemodeCard
          icon={<PuzzleSvg aria-hidden="true" focusable="false" />}
          title={t('dailyPuzzle.title')}
          description={t('home.gamemodeSelection.dailyDescription')}
          onPlay={() =>
            router.push(DAILY_PUZZLE_URL(new Date().toISOString().slice(0, 10)))
          }
        />
        <GamemodeCard
          icon={<BotSvg aria-hidden="true" focusable="false" />}
          title={t('home.gamemodeSelection.aiTitle')}
          description={t('home.gamemodeSelection.aiDescription')}
          onPlay={() => router.push(TIC_TAC_TOE_AI_URL)}
        />
        <GamemodeCard
          icon={<PvPSvg aria-hidden="true" focusable="false" />}
          title={t('home.gamemodeSelection.playersTitle')}
          description={t('home.gamemodeSelection.playersDescription')}
          withBandage
          bandagetitle={t('home.gamemodeSelection.comingSoon')}
        />
      </div>
    </DialogContent>
  );
};
