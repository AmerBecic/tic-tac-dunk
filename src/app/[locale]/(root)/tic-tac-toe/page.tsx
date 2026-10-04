import type { Metadata } from 'next';

import { TIC_TAC_TOE_URL } from '@/core/constants/Routes';
import { generateMetadataForRoute } from '@/core/utils/MetadataGenerics';
import { TicTacToe } from '@/features/tic-tac-toe';

export const generateMetadata = (): Promise<Metadata> =>
  generateMetadataForRoute('ticTacToe', TIC_TAC_TOE_URL);

export default TicTacToe;
