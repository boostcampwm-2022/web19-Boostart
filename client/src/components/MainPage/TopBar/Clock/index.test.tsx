import React from 'react';
import { act, render } from '@testing-library/react';
import Clock from './index';

const renderClock = () => {
  const result = render(<Clock />);
  const now = new Date().toTimeString().substring(0, 5);
  console.log(now);
  const DigitalClock = () => result.getByText(now);

  return {
    DigitalClock,
  };
};

describe('components/TopBar/Clock/index.tsx', () => {
  it('현재 시각을 나타내는 디지털 시계', async () => {
    const { DigitalClock } = renderClock();
    expect(DigitalClock()).toBeInTheDocument();
  });
});
