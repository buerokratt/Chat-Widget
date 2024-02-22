import { useEffect, useState } from 'react';
import sse from '../services/sse-service';

const useQueueCountr = () => {
  const [counter, setCounter] = useState();

  useEffect(() => {
    const onMessage = async (data: any) => {   
      setCounter(data);
    }

    const events = sse('/queue', onMessage);

    return () => {
      events?.close();
    };
  }, []);

  return [counter];
};

export default useQueueCountr;
