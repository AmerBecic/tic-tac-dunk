'use client';

import { useQueryClient } from '@tanstack/react-query';
import { GET_ACTIVE_AI_GAME_QUERY_KEY } from '@/core/constants/QueryKeys';
import type { GetActiveAiGameResponse } from '@/domains/tic-tac-toe/types/get.active.ai.game.response.dto';
import { useTranslations } from 'next-intl';
import { DialogContent } from '@/features/shared/ui/dialog';
import {
  DAILY_PUZZLE_URL,
  DAILY_PUZZLE_LIST_URL,
  TIC_TAC_TOE_URL,
} from '@/core/constants/Routes';
import { useRouter } from '@/core/i18n/navigation';
import { GamemodeCard } from '@/features/shared/gamemode-card';
import PreviousSvg from '@/assets/Previous.svg';
import PuzzleSvg from '@/assets/Puzzle.svg';
import BotSvg from '@/assets/Bot.svg';
import PvPSvg from '@/assets/PvP.svg';
import styles from './GamemodeSelection.module.scss';
import { useGetActiveAiGame } from '@/domains/tic-tac-toe/hooks/useGetActiveAiGame';
import { useCreateTicTacToeMatch } from '@/domains/tic-tac-toe/hooks/useCreateTicTacToeMatch';
import { DEFAULT_TURN_DURATION_SECONDS } from '@/domains/tic-tac-toe/types/tic-tac-toe.constants';

export const GamemodeSelection = () => {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeAiGame, isLoading, isError } = useGetActiveAiGame();
  const { createTicTacToeMatch, isPending } = useCreateTicTacToeMatch();

  const handlePlayAi = async () => {
    if (isLoading || isPending || isError) return;

    const match =
      activeAiGame ??
      (await createTicTacToeMatch({
        mode: 'AI',
        turnDurationSeconds: DEFAULT_TURN_DURATION_SECONDS,
      }));
    if (!match) return;

    await queryClient.cancelQueries({
      queryKey: [GET_ACTIVE_AI_GAME_QUERY_KEY],
    });
    queryClient.setQueryData<GetActiveAiGameResponse>(
      [GET_ACTIVE_AI_GAME_QUERY_KEY],
      { success: true, data: match }
    );

    router.push(TIC_TAC_TOE_URL);
  };

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
          onPlay={handlePlayAi}
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
