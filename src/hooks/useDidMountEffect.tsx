import { useEffect, useRef } from 'react';

// From: https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render
const useDidMountEffect = (deps: Array<any>, func?: (() => void)) => {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

export default useDidMountEffect;