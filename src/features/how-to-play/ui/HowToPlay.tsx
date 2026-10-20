import { getTranslations } from 'next-intl/server';
import { Text } from '@/features/shared/ui/text';
import styles from './HowToPlay.module.scss';

export const HowToPlay = async () => {
  const t = await getTranslations('howToPlay');

  return (
    <article className={styles.page}>
      <h1 className={styles.title}>
        <Text as="span">{t('titleStart')} </Text>
        <Text as="span" className={styles.highlight}>
          {t('titleHighlight')}
        </Text>
      </h1>

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="game-modes">
          <h2 id="game-modes">{t('modes.title')}</h2>
          <p>{t('modes.intro')}</p>
          <ul>
            <li>
              <strong>{t('daily.title')}</strong> — {t('modes.daily')}
            </li>
            <li>
              <strong>{t('ticTacToe.title')}</strong> — {t('modes.ticTacToe')}
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="shared-rules">
          <h2 id="shared-rules">{t('shared.title')}</h2>
          <p>{t('shared.intro')}</p>
          <ol>
            <li>{t('shared.grid')}</li>
            <li>{t('shared.select')}</li>
            <li>{t('shared.submit')}</li>
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="game-rules">
          <h2 id="game-rules">{t('rulesTitle')}</h2>
          <h3>{t('daily.title')}</h3>
          <ul>
            <li>{t('daily.goal')}</li>
            <li>{t('daily.schedule')}</li>
          </ul>
          <h3>{t('ticTacToe.title')}</h3>
          <ul>
            <li>{t('ticTacToe.opponent')}</li>
            <li>
              {t.rich('ticTacToe.timer', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </li>
            <li>{t('ticTacToe.correct')}</li>
            <li>{t('ticTacToe.incorrect')}</li>
            <li>
              {t.rich('ticTacToe.win', {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
};
