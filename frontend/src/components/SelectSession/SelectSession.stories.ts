import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SelectSession, ScheduleSession } from './SelectSession';

const meta:Meta<typeof SelectSession> = {
    title: 'UI/SelectSession',
    component: SelectSession,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        onSelect: { action: 'selected' },
    },
    args: {
        onSelect: fn(),
        selected: null,
    },
} satisfies Meta<typeof SelectSession>;

export default meta;
type Story = StoryObj<typeof meta>;

const sessions: ScheduleSession[] = [
    {
        id: '1',
        day: 'Monday',
        time: '10:00',
    },
    {
        id: '2',
        day: 'Monday',
        time: '12:00',
    },
    {
        id: '3',
        day: 'Tuesday',
        time: '11:00',
    },
    {
        id: '4',
        day: 'Wednesday',
        time: '12:00',
    },
];

export const Default: Story = {
    args: {
        sessions,
        selected: null,
    },
};

export const Selected: Story = {
    args: {
        sessions,
        selected: '2',
    },
};