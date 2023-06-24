import {
  useEffect,
  useRef,
} from 'react';

import { Box } from '@chakra-ui/react';

export const CanvasElement: React.FC<{
  height: number;
  render:(context :CanvasRenderingContext2D) => void;
}> = ({ render, height }) => {

  const ref = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!render || !ref.current || !boxRef.current) {
      return;
    }

    if (ref.current.width  != boxRef.current.offsetWidth) {
      ref.current.width  = boxRef.current.offsetWidth;
      ref.current.height = boxRef.current.offsetHeight;
    }

    const interval = setInterval(() => {
      render(ref.current!.getContext('2d') as CanvasRenderingContext2D);
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [render]);

  return (
    <Box w="100%" position="relative" ref={boxRef}>
      <canvas style={{  height:`${height}px`}} ref={ref}   height={`${height}px`} />
    </Box>
  );
};
