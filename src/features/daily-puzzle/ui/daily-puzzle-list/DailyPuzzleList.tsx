import { getLocale, getTranslations } from 'next-intl/server';

import CheckmarkSvg from '@/assets/Checkmark.svg';
import { DailyPuzzleDateTile } from './DailyPuzzleDateTile';
import { FlipTile } from '@/features/shared/flip-tile';
import { Logo } from '@/features/shared/logo';
import { Paragraph } from '@/features/shared/ui/paragraph';
import styles from './DailyPuzzleList.module.scss';

export const DailyPuzzleList = async (): Promise<React.JSX.Element> => {
  const [locale, t] = await Promise.all([getLocale(), getTranslations()]);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dates = Array.from({ length: 15 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - index - 1);
    return date.toISOString().slice(0, 10);
  });

  return (
    <section
      className={styles.dailyPuzzleList}
      aria-label={t('dailyPuzzleList.title')}
    >
      <div className={styles.grid}>
        <FlipTile
          className={styles.titleTile}
          isFlipped={false}
          front={
            <>
              <Logo showLabel={false} />
              <Paragraph className={styles.title}>
                {t('dailyPuzzleList.title')}
              </Paragraph>
            </>
          }
          back={
            <>
              <CheckmarkSvg
                className={styles.completionCheck}
                fill="currentColor"
                stroke="currentColor"
                aria-hidden="true"
                focusable="false"
              />
              <span className={styles.completedLabel}>
                {t('dailyPuzzle.completed')}
              </span>
            </>
          }
        />
        {dates.map((date) => (
          <DailyPuzzleDateTile
            key={date}
            date={date}
            locale={locale}
            completedLabel={t('dailyPuzzle.completed')}
          />
        ))}
      </div>
    </section>
  );
};
