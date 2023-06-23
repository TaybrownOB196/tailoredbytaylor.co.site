import Slider from './Slider';

export default {
  title: 'Slider',
  component: Slider,
  tags: ['autodocs']
};

export const Primary = {
  render: () => <Slider minValue={0} maxValue={10} initValue={5} />
};