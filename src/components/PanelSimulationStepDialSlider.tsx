import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Matter from 'matter-js';

import { useMetaframe } from '@metapages/metaframe-hook';

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
    var engine = Engine.create({
      positionIterations: 20,
      velocityIterations: 10,
    });
    var world = engine.world;
    // create a renderer
    var render = Render.create({
      element: document.getElementById("matter-js")!,
      engine: engine,
      options: {
        width: 2000,
        height: 1000,
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

    const widgetCenter = { x: 150, y: 400 };
    const baseHeight = 100;

    // const toothWidth = 30;
    const toothRadius = 30;
    const toothSpacing = 165;
    const toothIntervalX = toothSpacing + (toothRadius * 2);
    const staticWallWidth = 200;
    const toothClampWallHeight = 400;
    const toothClampWallWidth = 200;

    const heavyTopToothRadius = 100;

    const selections = 6;
    const selection = 0;
    const friction = 0.5;

    // const collidingGroup = Body.nextGroup(true);
    const nonCollidingGroup = Body.nextGroup(false);

    // Widget sliding base
    const baseWidth = (selections + 1) * toothIntervalX;
    // const totalBaseWidth = selections * toothIntervalX + toothClampWallWidth * 2;


    var slidingBaseBody = Bodies.rectangle(
      widgetCenter.x + (baseWidth / 2) - toothIntervalX,
      widgetCenter.y + baseHeight / 2 + toothRadius,
      // totalBaseWidth,
      baseWidth,
      baseHeight,
      {
        // friction,
        friction: 0,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: "#060a19" },
      }
    );
    setBody(slidingBaseBody);
    console.log('slidingBaseBody.position.x', slidingBaseBody.position.x);


    // add clamps to the sides of the base slider
    // left
    var slidingBaseClampLeft = Bodies.rectangle(
      slidingBaseBody.position.x - (baseWidth / 2) - toothIntervalX - heavyTopToothRadius,
      widgetCenter.y + toothRadius,
      toothClampWallWidth,
      toothClampWallWidth,
      {
        // friction,
        friction: 0,
        inertia: Infinity,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: "#060a19" },
      }
    );
    Composite.add(world, Constraint.create({
      bodyA: slidingBaseBody,
      pointA: {
        x: - (baseWidth / 2) - toothIntervalX - heavyTopToothRadius,
        y: widgetCenter.y - slidingBaseBody.position.y + toothRadius,
      },
      pointB: { x: 0, y: 0 },
      bodyB: slidingBaseClampLeft,
    }));


    // right
    var slidingBaseClampRight = Bodies.rectangle(
      slidingBaseBody.position.x + (baseWidth / 2)  + heavyTopToothRadius,
      widgetCenter.y + toothRadius,
      toothClampWallWidth,
      toothClampWallWidth,
      {
        // friction,
        friction: 0,
        inertia: Infinity,
        collisionFilter: { group: nonCollidingGroup },
        chamfer: { radius: 10 },
        render: { fillStyle: "#060a19" },
      }
    );
    Composite.add(world, Constraint.create({
      bodyA: slidingBaseBody,
      pointA: {
        x: (baseWidth / 2)  + heavyTopToothRadius,
        y: widgetCenter.y - slidingBaseBody.position.y + toothRadius,
      },
      pointB: { x: 0, y: 0 },
      bodyB: slidingBaseClampRight,
    }));


    // FAILS:
    // don't let it move up/down
    // Events.on(engine, 'beforeUpdate', function(event) {
    //     slidingBaseBody.position.y = widgetCenter.y + 10;
    // });



    // const teethHeightOffsetY = (toothRadius );
    const teeth = [...Array(selections)].map((_, i) => {
      var tooth = Bodies.circle(
        widgetCenter.x + toothIntervalX * i,
        widgetCenter.y,
        toothRadius,
        {
          friction,
          mass: 5,
          // inertia: Infinity,
          restitution: 0,
          render: { fillStyle: "#060a19" },
          collisionFilter: { group: nonCollidingGroup },
        }
      );
      const toothConstraint = Constraint.create({
        bodyA: slidingBaseBody,
        pointA: {
          x: (-baseWidth / 2) + toothIntervalX * i +  toothIntervalX,
          y: - toothRadius - baseHeight / 2,
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
      widgetCenter.y - toothRadius - toothRadius * 2 - heavyTopToothRadius / 2,// - (heavyTopToothRadius + baseHeight / 2 + 60),
      heavyTopToothRadius,
      {
        mass: 100,
        inertia: Infinity,
        restitution: 0,
        friction: 0,
        render: { fillStyle: "#060a19" } ,
      }
    );

    // Composite.add(
    //   world,
    //   Constraint.create({
    //     pointA: { x: topTooth.position.x, y: topTooth.position.y },
    //     pointB: { x: 0, y: 0 },
    //     bodyB: topTooth,
    //     stiffness: 0.2,
    //     length: 60,
    //     damping: 0.1,
    //   })
    // );




      const walls = [
        // walls

      // upper tooth left block
      Bodies.rectangle(
        topTooth.position.x - heavyTopToothRadius - staticWallWidth / 2,
        widgetCenter.y - toothRadius * 2  - toothClampWallHeight / 2 - 2,
        toothClampWallWidth,
        toothClampWallHeight,
        { isStatic: true, friction: 0,  }
      ),
      // upper tooth right block
      Bodies.rectangle(
        topTooth.position.x + heavyTopToothRadius + staticWallWidth / 2 + 2,
        widgetCenter.y - toothRadius * 2  - toothClampWallHeight / 2 - 2,
        toothClampWallWidth,
        toothClampWallHeight,
        { isStatic: true, friction: 0,  }
      ),
      // upper tooth top block
      Bodies.rectangle(
        topTooth.position.x,
        widgetCenter.y - toothRadius * 2  - toothClampWallHeight - 2,
        toothClampWallWidth * 2 + heavyTopToothRadius * 2,
        staticWallWidth,
        { isStatic: true, friction: 0,  }
      ),


      // slider top clamp left
      // Bodies.rectangle(
      //   widgetCenter.x - toothClampWallWidth - 10,
      //   widgetCenter.y + baseHeight / 2 + staticWallWidth / 2,
      //   4200,
      //   staticWallWidth,
      //   { isStatic: true, friction: 0, }
      // ),

      // slider base
      Bodies.rectangle(
        widgetCenter.x,
        widgetCenter.y + baseHeight + staticWallWidth / 2,
        4200,
        staticWallWidth,
        { isStatic: true, friction: 0, }
      ),
      ];


    Composite.add(world, [
      ...teeth,
      ...walls,
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

    // 📐📐📐📐📐📐📐📐📐📐📐📐📐
    // 📐📐 END ACTUAL CODE
    // 📐 BEGIN COMMON ENGINE INIT
    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // fit the render viewport to the scene
    Render.lookAt(render, [...teeth,
      ...walls,
      topTooth,
      slidingBaseClampLeft,
      slidingBaseClampRight,
      slidingBaseBody,]
    //   , {

    //   {
    //   objects: [],
    //   // min: { x: 0, y: 0 },
    //   // max: { x: 2000, y: 600 },
    // }
    );
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
    const disposer = metaframe.onInput("input-rotation", (value: number) => {
      // console.log('value', value);
      Matter.Body.applyForce(
        body,
        { x: body.position.x, y: body.position.y },
        { x: -0.08 * (value > 0 ? 1 : -1), y: 0 }
      );
      // const { x, y } = metaframeObject;
      // Body.setPosition(body, { x, y });
    });

    return () => {
      disposer();
    };
  }, [metaframeObject?.metaframe, body]);

  const ref = useRef<HTMLDivElement>(null);

  return <div id="matter-js" ref={ref}></div>;
};
