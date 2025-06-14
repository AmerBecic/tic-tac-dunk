import { TextProps, Text } from '@/components/shared/text';

export const Paragraph = (props: TextProps<'p'>): JSX.Element => (
  <Text as="p" fontSize="16" fontFamily="inter" {...props} />
);
