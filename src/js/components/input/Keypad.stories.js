import { Keypad } from './Keypad';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Keypad',
  component: Keypad,
  tags: ['autodocs']
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
    render: () => <Keypad keys={[1,2,3,4,5,6,7,8,9]} />
};