import { TextProps } from '../text';
import { Text } from '../text';

export const Paragraph = (props: TextProps<'p'>): JSX.Element => (
  <Text as="p" fontSize="16" fontFamily="inter" {...props} />
);
