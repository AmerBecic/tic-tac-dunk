import { useTranslations } from 'next-intl';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';
import styles from './MatchScoreboard.module.scss';
import { FlipTile } from '@/features/shared/flip-tile';

const SEGMENTS = [
  [10, 6, 30, 6],
  [34, 10, 34, 30],
  [34, 38, 34, 58],
  [10, 62, 30, 62],
  [6, 38, 6, 58],
  [6, 10, 6, 30],
  [10, 34, 30, 34],
];
const DIGITS: Record<string, string> = {
  '0': '1111110',
  '1': '0110000',
  '2': '1101101',
  '3': '1111001',
  '4': '0110011',
  '5': '1011011',
  '6': '1011111',
  '7': '1110000',
  '8': '1111111',
  '9': '1111011',
  '-': '0000001',
};

interface MatchScoreboardProps {
  match: Pick<Match, 'mode' | 'status' | 'currentPlayer' | 'winner'>;
  secondsLeft: number;
  playerName?: string;
}

export const MatchScoreboard = ({
  match,
  secondsLeft,
  playerName,
}: MatchScoreboardProps) => {
  const t = useTranslations('ticTacToe');
  const isActive = match.status === 'ACTIVE';
  const activePlayer = isActive ? match.currentPlayer : null;
  const digits = isActive
    ? String(Math.max(0, secondsLeft)).padStart(2, '0')
    : '--';
  const players = [
    { id: 'PLAYER1', name: playerName || t('player1'), mark: 'X' },
    {
      id: 'PLAYER2',
      name: t(match.mode === 'AI' ? 'bot' : 'player2'),
      mark: 'O',
    },
  ];
  const status = isActive
    ? activePlayer
      ? t('activeTurn', {
          player: players.find((player) => player.id === activePlayer)!.name,
        })
      : t('waiting')
    : t(match.status === 'WAITING' ? 'waiting' : 'finished');

  const renderPlayer = (player: (typeof players)[number]) => {
    const result =
      match.status === 'FINISHED'
        ? match.winner
          ? match.winner === player.id
            ? 'win'
            : 'lost'
          : 'draw'
        : undefined;

    return (
      <div
        className={styles.player}
        data-active={activePlayer === player.id || undefined}
        data-result={result}
      >
        <FlipTile
          className={styles.mark}
          isFlipped={Boolean(result)}
          animate
          role="status"
          front={<span>{player.mark}</span>}
          back={
            <span className={styles.result}>{result ? t(result) : null}</span>
          }
        />
        <span className={styles.playerName}>{player.name}</span>
      </div>
    );
  };

  return (
    <div className={styles.scoreboard}>
      <span className={styles.srOnly} role="status">
        {status}
      </span>
      {renderPlayer(players[0])}
      <div className={styles.clock}>
        <span className={styles.clockLabel}>{t('shotClock')}</span>
        <div
          className={styles.display}
          role="timer"
          aria-live="off"
          aria-label={
            isActive ? t('secondsRemaining', { seconds: secondsLeft }) : status
          }
        >
          <svg
            viewBox={`0 0 ${digits.length * 44 - 4} 68`}
            aria-hidden="true"
            focusable="false"
          >
            {Array.from(digits, (digit, index) => (
              <g key={index} transform={`translate(${index * 44}, 0)`}>
                {SEGMENTS.map(([x1, y1, x2, y2], segment) => (
                  <g
                    key={segment}
                    className={
                      DIGITS[digit][segment] === '1' ? styles.lit : styles.unlit
                    }
                  >
                    {Array.from({ length: 6 }, (_, dot) => (
                      <circle
                        key={dot}
                        cx={x1 + ((x2 - x1) * dot) / 5}
                        cy={y1 + ((y2 - y1) * dot) / 5}
                        r="1.6"
                      />
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>
      </div>
      {renderPlayer(players[1])}
    </div>
  );
};
