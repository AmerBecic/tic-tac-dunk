'use client';

import { useTranslations } from 'next-intl';
import { useId, type JSX, type ReactNode, type MouseEventHandler } from 'react';

import { cn } from '@/core/utils/Utils';
import { Button } from '@/features/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardTitleProps,
} from '@/features/shared/ui/card';

import styles from './GamemodeCard.module.scss';

interface BaseGamemodeCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  playLabel?: string;
  disabled?: boolean;
  headingAs?: CardTitleProps['as'];
  className?: string;
}

export type GamemodeCardProps = BaseGamemodeCardProps &
  (
    | {
        withBandage: true;
        bandagetitle: string;
        onPlay?: MouseEventHandler<HTMLButtonElement>;
      }
    | {
        withBandage?: false;
        bandagetitle?: string;
        onPlay: MouseEventHandler<HTMLButtonElement>;
      }
  );

export const GamemodeCard = ({
  icon,
  title,
  description,
  onPlay,
  playLabel,
  disabled = false,
  headingAs = 'h2',
  className,
  withBandage = false,
  bandagetitle,
}: GamemodeCardProps): JSX.Element => {
  const t = useTranslations('common');
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const playId = `${id}-play`;

  return (
    <Card
      className={cn(styles.card, withBandage && styles.unavailable, className)}
    >
      {withBandage && <span className={styles.bandage}>{bandagetitle}</span>}
      <CardHeader className={styles.header}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <CardTitle as={headingAs} id={titleId} className={styles.title}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <CardDescription id={descriptionId} className={styles.description}>
          {description}
        </CardDescription>
      </CardContent>
      {!withBandage && (
        <CardFooter className={styles.footer}>
          <Button
            type="button"
            size="xl"
            className={styles.playButton}
            onClick={onPlay}
            disabled={disabled}
            aria-labelledby={`${playId} ${titleId}`}
            aria-describedby={descriptionId}
          >
            <span id={playId}>{playLabel ?? t('play_now')}</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
