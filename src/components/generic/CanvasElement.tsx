import {
  useEffect,
  useRef,
} from 'react';

import { Box } from '@chakra-ui/react';

export const CanvasElement: React.FC<{
  height: number;
  render: (context: CanvasRenderingContext2D) => void;
}> = ({ render, height }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!render || !ref.current || !boxRef.current) {
      return;
    }

    if (ref.current.width != boxRef.current.offsetWidth) {
      ref.current.width = boxRef.current.offsetWidth;
      ref.current.height = boxRef.current.offsetHeight;
    }

    const interval = setInterval(() => {
      if (ref.current?.getContext("2d")) {
        render(ref.current.getContext("2d") as CanvasRenderingContext2D);
      }
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [render]);

  return (
    <Box w="100%" position="relative" ref={boxRef}>
      <canvas
        style={{ height: `${height}px` }}
        ref={ref}
        height={`${height}px`}
      />
    </Box>
  );
};

export const CanvasElementRenderValue: React.FC<{
  height: number;
  value: number;
}> = ({ value, height }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const maxValueRef = useRef<number>(Number.MIN_VALUE);
  const minValueRef = useRef<number>(Number.MAX_VALUE);
  useEffect(() => {
    if (!ref.current || !boxRef.current) {
      return;
    }
    if (value === undefined || value === null || isNaN(value)) {
      return;
    }

    if (ref.current.width != boxRef.current.offsetWidth) {
      ref.current.width = boxRef.current.offsetWidth;
      ref.current.height = boxRef.current.offsetHeight;
    }

    const ctx = ref.current!.getContext("2d") as CanvasRenderingContext2D;
    maxValueRef.current = Math.max(maxValueRef.current, value);
    minValueRef.current = Math.min(minValueRef.current, value);

    const total = (maxValueRef.current - minValueRef.current);
    const valueNormalized = (value + total / 2) / (maxValueRef.current - minValueRef.current);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw the rect on the transformed context
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, valueNormalized * ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "14px serif";
    ctx.fillText(`${minValueRef.current}`, 2, 16);
    ctx.fillText(`${value}`, 2 + ctx.canvas.width / 2, 16);
    ctx.fillText(`${maxValueRef.current}`, ctx.canvas.width - 100, 16);
  }, [value]);

  return (
    <Box w="100%" position="relative" ref={boxRef}>
      <canvas
        style={{ height: `${height}px` }}
        ref={ref}
        height={`${height}px`}
      />
    </Box>
  );
};

// export const CanvasElementRenderNormalValueNeg1To1: React.FC<{
//   height: number;
//   value: number;
// }> = ({ value, height }) => {
//   const ref = useRef<HTMLCanvasElement>(null);
//   const boxRef = useRef<HTMLDivElement>(null);
//   const maxValue = 1.0;
//   const minValue = 0;
//   useEffect(() => {
//     if (!ref.current || !boxRef.current) {
//       return;
//     }
//     if (value === undefined || value === null || isNaN(value)) {
//       return;
//     }

//     if (ref.current.width != boxRef.current.offsetWidth) {
//       ref.current.width = boxRef.current.offsetWidth;
//       ref.current.height = boxRef.current.offsetHeight;
//     }

//     const ctx = ref.current!.getContext("2d") as CanvasRenderingContext2D;

//     const valueNormalized = (value + 1 / 2) / (2);

//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     // draw the rect on the transformed context
//     ctx.fillStyle = "lightgrey";
//     ctx.fillRect(0, 0, valueNormalized * ctx.canvas.width, ctx.canvas.height);
//     ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = "black";
//     ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     ctx.stroke();
//     ctx.fillStyle = "black";
//     ctx.font = "14px serif";
//     ctx.fillText(`${value}`, 2 + ctx.canvas.width / 2, 16);
//   }, [value]);

//   return (
//     <Box w="100%" position="relative" ref={boxRef}>
//       <canvas
//         style={{ height: `${height}px` }}
//         ref={ref}
//         height={`${height}px`}
//       />
//     </Box>
//   );
// };
