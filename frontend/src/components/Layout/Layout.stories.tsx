import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';

const meta = {
  title: 'UI/Layout',
  component: Layout,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isLocked: { control: 'boolean' },
  },
  args: {
    children: 'Default content',
    isLocked: false,
  }
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default content',
    isLocked: false,
  },
};
