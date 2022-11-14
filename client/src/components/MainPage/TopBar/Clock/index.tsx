import React, { useState, useEffect } from 'react';
import { DigitalClock } from './style';

interface CurrentTime {
  hour: string;
  minute: string;
}

const Clock = () => {
  const [clockInfo, setClockInfo] = useState<CurrentTime>({ hour: '00', minute: '00' });
  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours().toString().padStart(2, '0');
    const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
    setClockInfo({ hour: currentHour, minute: currentMinute });

    const changeMinute = () => {
      const currentTime = new Date();
      const currentSecond = currentTime.getSeconds();
      if (currentSecond) return;
      const currentHour = currentTime.getHours().toString().padStart(2, '0');
      const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
      setClockInfo({ hour: currentHour, minute: currentMinute });
    };

    setInterval(() => {
      changeMinute();
    }, 1000);
  }, []);
  return (
    <>
      <DigitalClock>
        {clockInfo.hour}:{clockInfo.minute}
      </DigitalClock>
    </>
  );
};

export default Clock;
