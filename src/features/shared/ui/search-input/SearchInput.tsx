'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/core/utils/Utils';
import { Button } from '../button';
import { Input, type InputProps } from '../input';
import styles from './SearchInput.module.scss';

export type SearchInputProps = Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'children'
> & {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  clearable?: boolean;
  clearLabel?: string;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      className,
      containerClassName,
      clearable = true,
      clearLabel = 'Clear search',
      disabled,
      readOnly,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div
        className={cn(styles.container, containerClassName)}
        data-disabled={disabled || undefined}
      >
        <Search className={styles.icon} aria-hidden="true" />
        <Input
          {...props}
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : 'Search')}
          aria-labelledby={ariaLabelledBy}
          className={cn(styles.input, className)}
        />
        {clearable && value.length > 0 && !disabled && !readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            startIcon={<X className={styles.icon} aria-hidden="true" />}
            className={styles.clearButton}
            aria-label={clearLabel}
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
          />
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
