import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Matter from 'matter-js';

import { useMetaframe } from '@metapages/metaframe-hook';

const widgetCenter = { x: 150, y: 300 };
const baseHeight = 30;
const baseWidth = 800;
const toothWidth = 30;
const toothHeight = 30;
const toothGap = 80;
const selections = 6;
const friction = 0.5;

/**
 * Step dial
 *
 */
export const PanelSimulationStepDialSlider: React.FC = () => {


  // The core code
  useEffect(() => {
    if (!ref.current) {
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
      Composites = Matter.Composites,
      Vector = Matter.Vector,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Composite = Matter.Composite;
    // create an engine
    var engine = Engine.create();
    var world = engine.world;
    // create a renderer
    var render = Render.create({
      element: document.getElementById("matter-js")!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
        showAxes: true,
        showConvexHulls: true,
        showVelocity: true,
      },
    });
    // 📐 END COMMON PREAMBLE
    // 📐📐 BEGIN ACTUAL CODE
    // https://brm.io/matter-js/docs/
    // 📐📐📐📐📐📐📐📐📐📐📐📐📐

    // add bodies
    var group = Body.nextGroup(true),
      length = 200,
      width = 25;



    const collidingGroup = Body.nextGroup(true);
    const nonCollidingGroup = Body.nextGroup(false);

    // Widget sliding base
    var slidingBaseBody = Bodies.rectangle(widgetCenter.x, widgetCenter.y, baseWidth, baseHeight, {friction, collisionFilter: { group: nonCollidingGroup },  isStatic: false, chamfer: {radius:10}, render: { fillStyle: '#060a19' } });
    setBody(slidingBaseBody);

    const teeth = [...Array(selections)].map((_, i) => {
      // var tooth = Bodies.rectangle(widgetCenter.x + toothGap * i, widgetCenter.y - baseHeight , toothWidth, toothHeight, { isStatic: false, chamfer: {radius:5}, render: { fillStyle: '#060a19' }, collisionFilter: { group: nonCollidingGroup } });
      var tooth = Bodies.circle(widgetCenter.x + toothGap * i, widgetCenter.y - (toothHeight + baseHeight / 2) , toothHeight, { isStatic: false, friction, render: {  fillStyle: '#060a19' }, collisionFilter: { group: nonCollidingGroup } });
      const toothConstraint = Constraint.create({
        bodyA: slidingBaseBody,
        pointA: { x: toothGap * i, y: - (toothHeight + baseHeight / 2) },
        pointB: { x: 0, y: 0 },
        bodyB: tooth,

      });
      Composite.add(world, toothConstraint);
      return tooth;
    });






    // var stack = Composites.stack(350, 470 - 6 * size, 1, 6, 0, 0, function(x, y) {
    //     return Bodies.rectangle(x, y, size * 2, size, {
    //         slop: 0.5,
    //         friction: 1,
    //         frictionStatic: Infinity
    //     });
    // });

    Composite.add(world, [
      ...teeth,
      slidingBaseBody,
      // stack,
      // walls
      Bodies.rectangle(widgetCenter.x, widgetCenter.y + baseHeight + 30, 1200, 50, { isStatic: true }),
      // Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      // Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      // Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      // Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
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


    // 📐📐📐📐📐📐📐📐📐📐📐📐📐
    // 📐📐 END ACTUAL CODE
    // 📐 BEGIN COMMON ENGINE INIT
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 700, y: 600 },
    });
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
    };
  }, []);

  const [body, setBody] = useState<Matter.Body | null>(null);
  const metaframeObject = useMetaframe();
  useEffect(() => {
    const metaframe = metaframeObject.metaframe;
    if (!metaframe || !body) {
      return;
    }
    const disposer = metaframe.onInput("input-rotation", (value:number) => {
      console.log('value', value);
      Matter.Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: -0.08 * (value > 0 ? 1:-1), y: 0});
      // const { x, y } = metaframeObject;
      // Body.setPosition(body, { x, y });
    });



    return () => {
      disposer();
    }

  }, [metaframeObject?.metaframe, body]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
