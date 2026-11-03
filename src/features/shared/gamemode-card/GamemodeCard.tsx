'use client';

import { useId, type JSX, type ReactNode, type MouseEventHandler } from 'react';

import { cn } from '@/core/utils/Utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardTitleProps,
} from '@/features/shared/ui/card';

import styles from './GamemodeCard.module.scss';

interface BaseGamemodeCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
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
  disabled = false,
  headingAs = 'h2',
  className,
  withBandage = false,
  bandagetitle,
}: GamemodeCardProps): JSX.Element => {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

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
        <button
          type="button"
          className={styles.playButton}
          onClick={onPlay}
          disabled={disabled}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        />
      )}
    </Card>
  );
};
