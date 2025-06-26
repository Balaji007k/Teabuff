// AnimatedCounter.jsx
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ endValue, label }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true }); // run once when visible

  useEffect(() => {
    if (inView) {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        if (current <= endValue) {
          setCount(current);
        } else {
          clearInterval(interval);
        }
      }, 80);
    }
  }, [inView, endValue]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div className='Expri' style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>{count}{label}</div>
    </div>
  );
};

export default AnimatedCounter;