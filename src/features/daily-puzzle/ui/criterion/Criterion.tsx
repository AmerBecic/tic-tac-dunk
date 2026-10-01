'use client';

import type { GridCategory } from '@/domains/grid';
import { Paragraph } from '@/features/shared/ui/paragraph';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/features/shared/ui/tooltip';

import styles from './Criterion.module.scss';
import { TEAM_LOGOS } from '@/core/constants/TeamLogos';

export const Criterion = ({ category }: { category?: GridCategory }) => {
  const TeamIcon =
    category?.type === 'TEAM' &&
    category.referenceId &&
    Object.hasOwn(TEAM_LOGOS, category.referenceId)
      ? TEAM_LOGOS[category.referenceId]
      : undefined;

  const isTeam = category?.type === 'TEAM';
  const criterion = (
    <div
      className={styles.criterion}
      title={isTeam ? undefined : category?.label}
      tabIndex={isTeam ? 0 : undefined}
    >
      {TeamIcon ? (
        <span
          className={styles.teamLogo}
          role="img"
          aria-label={category?.label}
        >
          <span aria-hidden="true">
            <TeamIcon size={80} />
          </span>
        </span>
      ) : (
        category && (
          <Paragraph className={styles.criterionLabel}>
            {category.label}
          </Paragraph>
        )
      )}
    </div>
  );

  if (!isTeam) return criterion;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{criterion}</TooltipTrigger>
        <TooltipContent>
          <div>{category.label}</div>
          {category.includedNames?.map((name) => <div key={name}>{name}</div>)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
