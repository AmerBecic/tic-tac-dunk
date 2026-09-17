'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type JSX, type ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({
  children,
}: ReactQueryProviderProps): JSX.Element => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
