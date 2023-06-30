import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useStore } from '/@/store';
import Matter from 'matter-js';
import { fromEuler } from 'quaternion';

import {
  EulerArray,
  yawFromQuaternion,
} from '../common';
import {
  HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT,
} from './haptics/haptics-common';

const fillStyleBlocks = "#828583";
const fillStyleTeeth = "#828583";
const rectOverCircleTeeth = false;

/**
 * Step dial
 * Test with: https://app.metapage.io/dion/step-dial-iphone-v1/view?tab=0
 *
 */
export const StepDialSlider: React.FC<{
  steps: number;
  startStep?: number;
  setStep: (step: number) => void;
}> = ({ setStep, steps = 5, startStep = 0 }) => {
  const forceRef = useRef<number>(0);
  const [body, setBody] = useState<Matter.Body | null>(null);
  const deviceIO = useStore(
    (state) => state.deviceIO
  );

  // The core code
  useEffect(() => {
    if (!ref.current || !deviceIO) {
      return;
    }

    ref.current.innerHTML = "";

    // 📐📐📐📐📐📐📐📐📐📐📐📐📐
    // 📐 📐 📐  BEGIN PHYSICS CODE
    // 📐 BEGIN COMMON PREAMBLE
    // module aliases
    var Engine = Matter.Engine,
      Events = Matter.Events,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Composite = Matter.Composite;
    // create an engine
    var engine = Engine.create({
      positionIterations: 20,
      velocityIterations: 10,
    });
    var world = engine.world;
    // create a renderer
    var render = Render.create({
      element: document.getElementById("matter-js")!,
      engine,
      options: {
        width: 1000,
        height: 600,
        showAngleIndicator: true,
        showAxes: true,
        // showConvexHulls: true,
        showVelocity: true,
        // pixelRatio: 3,
        wireframes: false,
      },
    });
    // 📐 END COMMON PREAMBLE
    // 📐📐 BEGIN ACTUAL CODE
    // https://brm.io/matter-js/docs/
    // 📐📐📐📐📐📐📐📐📐📐📐📐📐

    // add bodies
    // var group = Body.nextGroup(true),
    //   length = 200,
    //   width = 25;

    const widgetCenter = { x: 150, y: 400 };
    const baseHeight = 100;

    // const toothWidth = 30;
    const toothRadius = 60;
    const toothSpacing = 295;
    const toothIntervalX = toothSpacing + toothRadius * 2;
    const staticWallWidth = 200;

    // const toothClampWallHeight = 400;
    const toothClampWallWidth = 200;
    const heavyTopToothRadius = 150;

    const sliderSideClampHeight = 300;

    // const selections = 6;
    let step = startStep;
    console.log(`metaframe.setOutput("position", step);`)
    // const selection = 0;
    const friction = 0.5;

    const topToothRestingY = heavyTopToothRadius - toothRadius;

    // const collidingGroup = Body.nextGroup(true);
    const nonCollidingGroup = Body.nextGroup(false);

    // Widget sliding base
    const baseWidth = (steps + 1) * toothIntervalX;

    var slidingBaseBody = Bodies.rectangle(
      widgetCenter.x +
        baseWidth / 2 -
        toothIntervalX -
        step * toothIntervalX +
        toothIntervalX,
      widgetCenter.y + baseHeight / 2 + toothRadius,
      baseWidth,
      baseHeight,
      {
        // friction,
        // frictionStatic: 0.1,
        friction: 0.001,
        restitution: 0,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: fillStyleBlocks },
      }
    );
    setBody(slidingBaseBody);
    // console.log('slidingBaseBody.position.x', slidingBaseBody.position.x);

    // add clamps to the sides of the base slider
    // left
    const toothClampWallHeight = toothClampWallWidth * 3;
    var slidingBaseClampLeft = Bodies.rectangle(
      slidingBaseBody.position.x -
        baseWidth / 2 -
        toothClampWallWidth / 2 -
        toothSpacing,
      slidingBaseBody.position.y - (sliderSideClampHeight / 2 + baseHeight),
      toothClampWallWidth,
      toothClampWallHeight,
      {
        friction: 0,
        restitution: 0,
        inertia: Infinity,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: fillStyleBlocks },
      }
    );
    Composite.add(
      world,
      Constraint.create({
        bodyA: slidingBaseBody,
        pointA: {
          x: -(baseWidth / 2) - toothClampWallWidth / 2 - toothSpacing,
          y: -(sliderSideClampHeight / 2 + baseHeight),
        },
        pointB: { x: 0, y: 0 },
        bodyB: slidingBaseClampLeft,
      })
    );

    // right
    var slidingBaseClampRight = Bodies.rectangle(
      // slidingBaseBody.position.x - baseWidth / 2 - toothClampWallWidth / 2,
      // slidingBaseBody.position.y - (sliderSideClampHeight / 2 + baseHeight),
      // toothClampWallWidth,
      // toothClampWallHeight,

      slidingBaseBody.position.x + baseWidth / 2 + toothClampWallWidth / 2,
      slidingBaseBody.position.y - (sliderSideClampHeight / 2 + baseHeight),
      toothClampWallWidth,
      toothClampWallHeight,
      {
        // friction,
        friction: 0,
        restitution: 0,
        inertia: Infinity,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: fillStyleBlocks },
      }
    );
    Composite.add(
      world,
      Constraint.create({
        bodyA: slidingBaseBody,
        pointA: {
          x: baseWidth / 2 + toothClampWallWidth / 2,
          y: -(sliderSideClampHeight / 2 + baseHeight),
        },
        pointB: { x: 0, y: 0 },
        bodyB: slidingBaseClampRight,
      })
    );

    // FAILS:
    // don't let it move up/down
    // Events.on(engine, 'beforeUpdate', function(event) {
    //     slidingBaseBody.position.y = widgetCenter.y + 10;
    // });

    // const teethHeightOffsetY = (toothRadius );
    const teethOptions = {
      friction,
      mass: 5,
      inertia: Infinity,
      restitution: 0,
      render: { fillStyle: fillStyleTeeth },
      collisionFilter: { group: nonCollidingGroup },
    };
    const teeth = [...Array(steps)].map((_, i) => {
      var tooth = Bodies.circle(
        widgetCenter.x +
          toothIntervalX * i -
          step * toothIntervalX +
          toothIntervalX,
        widgetCenter.y,
        toothRadius,
        teethOptions
      );
      if (rectOverCircleTeeth) {
        tooth = Bodies.rectangle(
          widgetCenter.x +
            toothIntervalX * i -
            step * toothIntervalX +
            toothIntervalX,
          widgetCenter.y,
          toothRadius * 2,
          toothRadius,
          teethOptions
        );
      }

      const toothConstraint = Constraint.create({
        bodyA: slidingBaseBody,
        pointA: {
          x: -baseWidth / 2 + toothIntervalX * i + toothIntervalX,
          y: -toothRadius - baseHeight / 2,
        },
        pointB: { x: 0, y: 0 },
        bodyB: tooth,
      });

      Composite.add(world, toothConstraint);
      return tooth;
    });

    // The other main tooth
    var topTooth = Bodies.circle(
      widgetCenter.x + toothIntervalX / 2,
      widgetCenter.y - (heavyTopToothRadius - toothRadius) - 10,
      // widgetCenter.y - toothRadius - toothRadius * 2 - heavyTopToothRadius / 2, // - (heavyTopToothRadius + baseHeight / 2 + 60),
      heavyTopToothRadius,
      {
        mass: 100,
        // inertia: Infinity,
        // restitution: 0,
        friction: 0,
        render: { fillStyle: fillStyleTeeth },
      }
    );

    // Composite.add(
    //   world,

    //   Constraint.create({
    //     pointA: { x: topTooth.position.x, y: topTooth.position.y + 220},
    //     pointB: { x: 0, y: 0 },
    //     bodyB: topTooth,
    //     stiffness: 0.2,
    //     length: 200,
    //     // damping: 0.1,
    //   })
    // );

    const walls = [
      // walls

      // upper tooth left block
      Bodies.rectangle(
        topTooth.position.x -
          heavyTopToothRadius -
          staticWallWidth / 2 -
          (rectOverCircleTeeth ? 10 : 0),
        widgetCenter.y - toothRadius * 2 - toothClampWallHeight / 2 - 2,
        toothClampWallWidth,
        toothClampWallHeight,
        {
          restitution: 0,
          isStatic: true,
          friction: 0,
          render: { fillStyle: fillStyleBlocks },
        }
      ),
      // upper tooth right block
      Bodies.rectangle(
        topTooth.position.x +
          heavyTopToothRadius +
          staticWallWidth / 2 +
          2 +
          (rectOverCircleTeeth ? 10 : 0),
        widgetCenter.y - toothRadius * 2 - toothClampWallHeight / 2 - 2,
        toothClampWallWidth,
        toothClampWallHeight,
        {
          restitution: 0,
          isStatic: true,
          friction: 0,
          render: { fillStyle: fillStyleBlocks },
        }
      ),
      // upper tooth top block
      Bodies.rectangle(
        topTooth.position.x,
        widgetCenter.y - toothRadius * 2 - toothClampWallHeight - 2,
        toothClampWallWidth * 2 + heavyTopToothRadius * 2,
        staticWallWidth,
        {
          restitution: 0,
          isStatic: true,
          friction: 0,
          render: { fillStyle: fillStyleBlocks },
        }
      ),

      // slider top clamp left
      // Bodies.rectangle(
      //   widgetCenter.x - toothClampWallWidth - 10,
      //   widgetCenter.y + baseHeight / 2 + staticWallWidth / 2,
      //   4200,
      //   staticWallWidth,
      //   { isStatic: true, friction: 0, }
      // ),
    ];

    const sliderFloor = // slider base
      Bodies.rectangle(
        widgetCenter.x,
        slidingBaseBody.position.y + baseHeight / 2 + staticWallWidth / 2,
        7200,
        staticWallWidth,
        {
          restitution: 0,
          isStatic: true,
          friction: 0,
          render: { fillStyle: fillStyleBlocks },
        }
      );

    Composite.add(world, [
      ...teeth,
      ...walls,
      sliderFloor,
      topTooth,
      slidingBaseBody,
      slidingBaseClampLeft,
      slidingBaseClampRight,
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(world, mouseConstraint);

    let canBeStuck = false;
    const newStepHapticDuration = 1000;
    const feedbackHapticDuration = 100;
    let timeSinceLastStep = Date.now();
    let timeSinceLastHaptic = Date.now();
    Matter.Events.on(engine, "beforeUpdate", function (event) {
      // [0, some positive value]
      const toothRelativeToCenterY =
        widgetCenter.y - topTooth.position.y - topToothRestingY;
      // toothRadius * 2 is the height of circle teeth
      // toothRadius * 1.5 is the height of rect teeth
      const maxBigToothHeight = toothRadius * (rectOverCircleTeeth ? 1.5 : 2);
      // console.log('maxBigToothHeight', maxBigToothHeight);
      // console.log('toothRelativeToCenterY', toothRelativeToCenterY);
      const scaledBigToothHeight =
        Math.max(toothRelativeToCenterY, 0) / maxBigToothHeight;

      // const relativeHeight =  widgetCenter.y - topTooth.position.y ;
      // console.log("relativeHeight", relativeHeight);
      // console.log('topToothRestingY', topToothRestingY);
      let gotStuck = false;
      const now = Date.now();
      if (canBeStuck) {
        if (toothRelativeToCenterY <= 1) {
          canBeStuck = false;
          gotStuck = true;

          // Body.setVelocity(slidingBaseBody, { x: 0, y: 0 });
          Body.setVelocity(topTooth, { x: 0, y: 0 });
          Body.setAngularVelocity(topTooth, 0);
          // this is also where I set the step
          const index = teeth.findIndex(
            (t) => t.position.x > topTooth.position.x
          );
          // step = Math.round((widgetCenter.x + baseWidth / 2 - slidingBaseBody.position.y) / toothIntervalX);
          // console.log('step', index);
          if (index !== step) {
            step = index;
            // setStep(step);
            console.log(`metaframe.setOutput("position", index);`)
            // metaframe.setOutput("position", index);
            timeSinceLastStep = now + 1000;
            timeSinceLastHaptic = now;
            deviceIO.haptics.dispatch({
              pattern: [0, newStepHapticDuration],
              intensities: [0, 255],
            });
          }
        }
      } else {
        if (toothRelativeToCenterY > 20) {
          canBeStuck = true;
        }
      }
      if (
        scaledBigToothHeight > 0.4 &&
        now - timeSinceLastStep > newStepHapticDuration &&
        now - timeSinceLastHaptic > feedbackHapticDuration
      ) {
        // console.log('scaledBigToothHeight', scaledBigToothHeight)
        const amplitude = Math.floor(
          scaledBigToothHeight * HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT.max
        );
        // console.log('amplitude', amplitude)
        timeSinceLastHaptic = now;
        deviceIO.haptics.dispatch({
          pattern: [0, 10],
          intensities: [0, amplitude],
        });

        // const scaledYDistanceFromBottom = (toothRadius * 2) - toothRelativeToCenterY;
        // console.log('scaledYDistanceFromBottom', scaledYDistanceFromBottom);
      }

      //Apply force
      if (!gotStuck && forceRef.current !== 0) {
        // console.log('forceRef.current', forceRef.current);
        if (Math.abs(forceRef.current) > 0.4) {
          Body.setVelocity(slidingBaseBody, { x: forceRef.current * 10, y: 0 });
        } else {
          Body.setVelocity(slidingBaseBody, { x: 0, y: 0 });
        }
        // Matter.Body.applyForce(
        //   slidingBaseBody,
        //   { x: slidingBaseBody.position.x, y: slidingBaseBody.position.y },
        //   { x: 0.2 * forceRef.current, y: 0 }
        // );
      }

      // slider check step change
      // slidingBaseBody.position.x = widgetCenter.x + sliderStep * stepRef.current;

      // widgetCenter.x +
      //   baseWidth / 2 -
      //   toothIntervalX -
      //   step * toothIntervalX +
      //   toothIntervalX
    });
    // const checkToothHeight = setInterval(() => {
    //   const relativeHeight =  widgetCenter.y - topTooth.position.y ;
    //   console.log("relativeHeight", relativeHeight);
    //   console.log(topToothRestingY - relativeHeight)
    //   const isReadyToStick = topToothRestingY - relativeHeight > 0;
    //   if (isReadyToStick) {
    //     console.log("isReadyToStick", isReadyToStick);
    //   }
    //   // if (relativeHeight < -100) {
    //   // widgetCenter
    // }, 1000);

    // 📐📐📐📐📐📐📐📐📐📐📐📐📐
    // 📐📐 END ACTUAL CODE
    // 📐 BEGIN COMMON ENGINE INIT
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // fit the render viewport to the scene
    Render.lookAt(render, [
      ...teeth,
      ...walls,
      topTooth,
      slidingBaseClampLeft,
      slidingBaseClampRight,
      slidingBaseBody,
    ]);
    // run the renderer
    Render.run(render);
    // create runner
    var runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);
    // 📐 📐 📐 END PHYSICS CODE
    // 📐📐📐📐📐📐📐📐📐📐📐📐📐

    return () => {
      Runner.stop(runner);
      Render.stop(render);
      setBody(null);
      // clearInterval(checkToothHeight);
    };
  }, [setBody, forceRef, deviceIO, setStep, steps, startStep]);

  useEffect(() => {
    // const metaframe = metaframeObject.metaframe;
    if (!deviceIO || !body) {
      return;
    }
    const disposers: (() => void)[] = [];

    // const normalizer = createNormalizer(30, 1);
    // disposers.push(metaframe.onInput("input-rotation", (value: number) => {
    //   const valueNormalized = normalizer(value);
    //   forceRef.current = valueNormalized;
    // }));

    const rad = Math.PI / 180;
    const hapticInterval = 100;
    let timeLastHaptic = Date.now();

    const bindingOrientation = deviceIO.userOrientation.add((orientation: EulerArray) => {
      var q = fromEuler(
        orientation[0] * rad,
        orientation[1] * rad,
        orientation[2] * rad,
        "ZXY"
      );
      // this returns values from [-0.02, 0.02]
      let yaw = yawFromQuaternion(q);
      // console.log('yaw', yaw);
      yaw = Math.max(Math.min(yaw, 0.028), -0.028);
      const forceNormalized = (yaw - -0.028) / (0.028 - -0.028);
      console.log(`metaframe.setOutput("force", forceNormalized)`);
      const forceNormalizedNegative1ToPositive1 = forceNormalized * 2 - 1;
      forceRef.current = forceNormalizedNegative1ToPositive1;

      // const now = Date.now();
      // const absForceNormalizedNegative1ToPositive1 = Math.abs(forceNormalizedNegative1ToPositive1);
      // console.log('absForceNormalizedNegative1ToPositive1', absForceNormalizedNegative1ToPositive1);
      // if (absForceNormalizedNegative1ToPositive1 > 0.3 && now - timeLastHaptic > hapticInterval) {
      //   const amplitude = Math.floor((absForceNormalizedNegative1ToPositive1 - 0.3) * 255);
      //   console.log('amplitude', amplitude);
      //   metaframe.setOutput("h", {duration: hapticInterval, amplitude });
      //   // metaframe.setOutput("h", {duration: hapticInterval, amplitude });
      //   // metaframe.setOutput("hg", {medium: true});
      //   timeLastHaptic = now;
      // }

      // console.log('forceNormalized', forceNormalized);
      // console.log('o-yaw', yaw);
    });
    disposers.push(() => deviceIO.userOrientation.detach(bindingOrientation));

    // disposers.push(
    //   metaframe.onInput("o", (orientation: number[]) => {

    //   })
    // );

    // disposers.push(metaframe.onInput("oa", (orientation: number[]) => {
    //   var q = fromEuler(orientation[0] * rad, orientation[1] * rad, orientation[2] * rad, 'ZXY');
    //   const yaw = yawFromQuaternion(q);
    //   // console.log('oa-yaw', yaw);
    // }));

    return () => {
      while (disposers.length > 0) {
        disposers.pop()?.();
      }
    };
  }, [deviceIO]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
