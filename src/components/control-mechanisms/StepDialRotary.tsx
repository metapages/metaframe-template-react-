import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useStore } from '/@/store';
import Matter from 'matter-js';

/**
 * Step dial
 *
 */
export const StepDialRotary: React.FC = () => {


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

    var rotateCenter = { x: 150, y: 300 };

    const collidingGroup = Body.nextGroup(true);


    // add bodies
    var size = 200,
        x = 200,
        y = 200,
        partA = Bodies.rectangle(x, y, size, size / 5),
        partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render, collisionFilter: { group: collidingGroup } });

    var compoundBodyA = Body.create({
        parts: [partA, partB],
        frictionStatic: 0.5,
        collisionFilter: { group: -1 },
    });
    setBody(compoundBodyA);

    Composite.add(world, compoundBodyA);


    // var circle = Bodies.circle(rotateCenter.x, rotateCenter.y, 50, {
    //   collisionFilter: { group: group },
    //   render: {
    //     fillStyle: "transparent",
    //     lineWidth: 1,
    //   },
    // });
    // Composite.add(world, circle);

    // var anchor = Bodies.rectangle(rotateCenter.x, rotateCenter.y, 200, 30, {
    //   isStatic: true,
    //   collisionFilter: { group: group },
    //   render: {
    //     fillStyle: "transparent",
    //     lineWidth: 1,
    //   },
    // });

    Composite.add(
      world,
      Constraint.create({
        pointA: rotateCenter,
        bodyB: compoundBodyA,
        pointB: { x: 0, y: 0 },
        // bodyA: compoundBodyA,
        // bodyB: anchor,
        // pointB: { x: 0, y: 0 },
        // pointB: { x: anchor.position.x, y: anchor.position.y },
        stiffness: 0.2,
        length: 0,
        render: {
          strokeStyle: "#4a485b",
        },
      })
    );
    compoundBodyA.angle = Math.PI / 2;


    // try to add a constraint for the "clicker"
    const selectorCenter = {x: rotateCenter.x - 40, y:rotateCenter.y - 40};
    const selectorBody = Bodies.circle(selectorCenter.x, selectorCenter.y, 20, {collisionFilter: { group: collidingGroup }});
    Composite.add(world, selectorBody);
    Composite.add(
      world,
      Constraint.create({
        // bodyA: compoundBodyA,
        bodyB: selectorBody,
        pointB: { x: 0, y: -10 },
        pointA: { x: selectorCenter.x, y: selectorCenter.y - 60 },
        stiffness: 0.9,
        length: 0,
        render: {
          strokeStyle: "#4a485b",
        },
      })
    );


    // Composite.add(world, anchor);




    // var switches: number = 4;
    // const angleIncrement = Math.PI / 3;

    // var compoundBodyA = Body.create({
    //   parts: [...new Array(switches)].map((_, i) => {
    //     const rect = Bodies.rectangle(
    //       rotateCenter.x,
    //       rotateCenter.y,
    //       width,
    //       length,
    //       {collisionFilter: { group: group } },
    //     );
    //     rect.angle = angleIncrement * i;
    //     return rect;
    //   }),
    // });
    // Composite.add(world, compoundBodyA);
    // Composite.add(
    //   world,
    //   Constraint.create({
    //     bodyA: compoundBodyA,
    //     // bodyB: anchor,
    //     // pointB: { x: 0, y: 0 },
    //     pointB: { x: anchor.position.x, y: anchor.position.y },
    //     stiffness: 0.9,
    //     length: 0,
    //     render: {
    //       strokeStyle: "#4a485b",
    //     },
    //   })
    // );





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
  const deviceIO = useStore(
    (state) => state.deviceIO
  );
  // const metaframeObject = useMetaframe();
  useEffect(() => {

    if (!deviceIO || !body) {
      return;
    }
    // ❗❗❗❗❗❗❗❗ commented out but this is where the action happens
    // const disposer = metaframe.onInput("input-rotation", (value:number) => {
    //   console.log('value', value);
    //   Matter.Body.applyForce(body, {x: body.position.x, y: body.position.y-10}, {x: -0.1 * value, y: 0});
    //   // const { x, y } = metaframeObject;
    //   // Body.setPosition(body, { x, y });
    // });



    return () => {
      // disposer();
    }

  }, [deviceIO, body]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
