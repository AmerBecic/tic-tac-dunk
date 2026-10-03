'use client';

import { useTranslations } from 'next-intl';
import { DAILY_PUZZLE_URL } from '@/core/constants/Routes';
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
    <div className={styles.grid}>
      <GamemodeCard
        icon={<PreviousSvg aria-hidden="true" focusable="false" />}
        title={t('home.gamemodeSelection.previousTitle')}
        description={t('home.gamemodeSelection.previousDescription')}
        withBandage
        bandagetitle={t('home.gamemodeSelection.comingSoon')}
      />
      <GamemodeCard
        icon={<PuzzleSvg aria-hidden="true" focusable="false" />}
        title={t('dailyPuzzle.title')}
        description={t('home.gamemodeSelection.dailyDescription')}
        onPlay={() => router.push(DAILY_PUZZLE_URL)}
      />
      <GamemodeCard
        icon={<BotSvg aria-hidden="true" focusable="false" />}
        title={t('home.gamemodeSelection.aiTitle')}
        description={t('home.gamemodeSelection.aiDescription')}
        withBandage
        bandagetitle={t('home.gamemodeSelection.comingSoon')}
      />
      <GamemodeCard
        icon={<PvPSvg aria-hidden="true" focusable="false" />}
        title={t('home.gamemodeSelection.playersTitle')}
        description={t('home.gamemodeSelection.playersDescription')}
        withBandage
        bandagetitle={t('home.gamemodeSelection.comingSoon')}
      />
    </div>
  );
};
