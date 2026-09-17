'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { JSX, ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

const client = new QueryClient();

export const QueryProvider = ({
  children,
}: ReactQueryProviderProps): JSX.Element => (
  <QueryClientProvider {...{ client }}>
    {children} <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
