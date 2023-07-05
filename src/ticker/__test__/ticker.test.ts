import Basic from "test/pages/basic/Basic";
import { Scene, clearScene } from "../scene";
import TickerSystem from "../system";

import allDirectionsSnapshot from "./data/all_direction.json";
import { Simulation, simulateItem } from "../simulation";
import { Item } from "../item";
import { LiveAttributes, LiveSize } from "../context";
import { angleToDirection } from "../math";

describe("ticker", () => {
    describe("scene", () => {
        afterEach(() => {
            Basic.clearContent();
        });
        it("should find and remove a given item condition", async () => {
            const container = new Scene<number>();

            // create 3 numbers and try to find them out-of-order
            const testNum1 = 123;
            const testNum2 = 456;
            const testNum3 = 789;

            container.add(testNum1);
            container.add(testNum2);
            container.add(testNum3);

            let testNum1FindResult = container.find((n) => n === testNum1);
            let testNum3FindResult = container.find((n) => n === testNum3);
            let testNum2FindResult = container.find((n) => n === testNum2);

            expect(testNum1FindResult[0]).toEqual(testNum1);
            expect(testNum2FindResult[0]).toEqual(testNum2);
            expect(testNum3FindResult[0]).toEqual(testNum3);

            // now delete these numbers and see if we actually removed them
            container.delete(testNum2FindResult[0]);
            testNum2FindResult = container.find((n) => n === testNum2);
            expect(0 in testNum2FindResult).toBeFalsy();

            container.delete(testNum3FindResult[0]);
            testNum3FindResult = container.find((n) => n === testNum3);
            expect(0 in testNum3FindResult).toBeFalsy();

            container.delete(testNum1FindResult[0]);
            testNum1FindResult = container.find((n) => n === testNum1);
            expect(0 in testNum1FindResult).toBeFalsy();
        });
        it("should delete objects only if they're in the container", async () => {
            const testContainer = new Scene<{ n: number }>();

            const testObject = { n: 123 };
            testContainer.add(testObject);

            // a similar object, but not the same reference
            testContainer.delete({ n: 123 });
            const case1 = testContainer.find((object) => object.n === 123);
            expect(0 in case1).toBeTruthy();

            // should remove the test object now
            testContainer.delete(testObject);
            const case2 = testContainer.find((object) => object.n === 123);
            expect(0 in case2).toBeFalsy();
        });
        it("should clear all contents in a container", async () => {
            const container = new Scene<{ n: number }>();

            // add some numbers, try to clear it all
            container.add({ n: 1 });
            container.add({ n: 2 });
            container.add({ n: 3 });

            clearScene(container);

            const testCase1 = container.find((obj) => obj.n === 1);
            const testCase2 = container.find((obj) => obj.n === 1);
            const testCase3 = container.find((obj) => obj.n === 1);

            expect(0 in testCase1).toBeFalsy();
            expect(0 in testCase2).toBeFalsy();
            expect(0 in testCase3).toBeFalsy();
        });
    });

    describe("item", () => {
        it("can move given speed and direction", async () => {
            const item = new Item();

            item.move(angleToDirection(0), 1);
            expect(item.position.x).toBeCloseTo(1);
            expect(item.position.y).toBeCloseTo(0);
            item.move(angleToDirection(90), 1);
            expect(item.position.x).toBeCloseTo(1);
            expect(item.position.y).toBeCloseTo(-1);
            item.move(angleToDirection(180), 1);
            expect(item.position.x).toBeCloseTo(0);
            expect(item.position.y).toBeCloseTo(-1);
            item.move(angleToDirection(270), 1);
            expect(item.position.x).toBeCloseTo(0);
            expect(item.position.y).toBeCloseTo(0);
        });

        it("can loop its position around a given rectangle", async () => {
            const item = new Item();
            const size = { width: 2, height: 1 };
            const limits = { horizontal: 3, vertical: 3 };

            // should loop if it reaches the limit in the right direction
            item.position.x = 3;
            item.loop(size, limits, angleToDirection(0));
            expect(item.position.x).toBeCloseTo(-2);

            // shouldn't change position if the direction is opposite
            item.position.x = 3;
            item.loop(size, limits, angleToDirection(180));
            expect(item.position.x).toBeCloseTo(3);

            // now it should change its position considering this direction
            item.position.x = -2;
            item.loop(size, limits, angleToDirection(180));
            expect(item.position.x).toBeCloseTo(3);

            // now it should change its position vertically
            item.position.y = -1;
            item.loop(size, limits, angleToDirection(90));
            expect(item.position.y).toBeCloseTo(3);

            // now it shouldn't change its position given an opposing direction
            item.position.y = -1;
            item.loop(size, limits, angleToDirection(270));
            expect(item.position.y).toBeCloseTo(-1);

            // now following the opposing direction, it should change its position
            item.position.y = 3;
            item.loop(size, limits, angleToDirection(270));
            expect(item.position.y).toBeCloseTo(-1);
        });
    });

    describe("simulation", () => {
        afterEach(() => {
            Basic.clearContent();
        });

        it("should fill and layout a grid of items", async () => {
            Basic.loadContent();

            const scene = new Scene<Item>();
            const sizes = new LiveSize({
                root: { width: 1188, height: 660 },
                item: { width: 396, height: 132 },
            });
            const attr = new LiveAttributes();
            const simulation = new Simulation(sizes, attr, scene);

            const resultScene = new Scene<Positionable>();
            const RESULT = [
                { position: { x: -396, y: -132 } },
                { position: { x: 0, y: -132 } },
                { position: { x: 396, y: -132 } },
                { position: { x: 792, y: -132 } },
                { position: { x: 1188, y: -132 } },
                { position: { x: -396, y: 0 } },
                { position: { x: 0, y: 0 } },
                { position: { x: 396, y: 0 } },
                { position: { x: 792, y: 0 } },
                { position: { x: 1188, y: 0 } },
                { position: { x: -396, y: 132 } },
                { position: { x: 0, y: 132 } },
                { position: { x: 396, y: 132 } },
                { position: { x: 792, y: 132 } },
                { position: { x: 1188, y: 132 } },
                { position: { x: -396, y: 264 } },
                { position: { x: 0, y: 264 } },
                { position: { x: 396, y: 264 } },
                { position: { x: 792, y: 264 } },
                { position: { x: 1188, y: 264 } },
                { position: { x: -396, y: 396 } },
                { position: { x: 0, y: 396 } },
                { position: { x: 396, y: 396 } },
                { position: { x: 792, y: 396 } },
                { position: { x: 1188, y: 396 } },
                { position: { x: -396, y: 528 } },
                { position: { x: 0, y: 528 } },
                { position: { x: 396, y: 528 } },
                { position: { x: 792, y: 528 } },
                { position: { x: 1188, y: 528 } },
                { position: { x: -396, y: 660 } },
                { position: { x: 0, y: 660 } },
                { position: { x: 396, y: 660 } },
                { position: { x: 792, y: 660 } },
                { position: { x: 1188, y: 660 } },
            ];
            for (const resultPosObj of RESULT) {
                resultScene.add(resultPosObj);
            }

            simulation.fill();
            simulation.layout();

            // go through our expected grid layout and see if our testContainer
            // did generate a match
            for (const resultPosObj of resultScene.contents) {
                const matchedPosObj = scene.find((item) => {
                    return (
                        resultPosObj.position.x === item.position.x &&
                        resultPosObj.position.y === item.position.y
                    );
                });

                expect({ position: matchedPosObj[0].position }).toEqual(
                    resultPosObj
                );
            }
        });

        it("should update a simulation deterministically over time", async () => {
            // we create a repeating pattern over a small box
            const sizes = new LiveSize({
                root: allDirectionsSnapshot.setup.tickerSize,
                item: allDirectionsSnapshot.setup.itemSize,
            });
            const attr = new LiveAttributes({ speed: 1, direction: 0 });
            const scene = new Scene<Item>();
            const simulation = new Simulation(sizes, attr, scene);

            // restart the system over 360 degrees
            for (let theta = 0; theta <= 360; theta++) {
                simulation.updateAttribute({ direction: theta });
                simulation.setup(); // start won't start if not stopped. have to start to stop...

                // keep track of each step of the animation updates
                const testMotionFrames = [];

                let t = 0;
                for (
                    let i = 0;
                    i < allDirectionsSnapshot.setup.numMotions;
                    i++
                ) {
                    const dt = i * allDirectionsSnapshot.setup.dt;
                    t += dt;
                    simulation.step(dt, t);
                }

                for (const item of scene.contents) {
                    testMotionFrames.push({
                        x: item.position.x.toFixed(2),
                        y: item.position.y.toFixed(2),
                    });
                }

                // keep things in a consistent order
                testMotionFrames.sort((a, b) => {
                    const xOrder = parseFloat(a.x) - parseFloat(b.x);
                    return xOrder;
                });

                // have to fix type errors
                const testData: {
                    [key: string]: { frames: { x: string; y: string }[] };
                } = allDirectionsSnapshot.data;
                expect(testMotionFrames).toEqual(
                    testData[theta.toString()].frames
                );
            }
        });

        it("should react to changes in size", async () => {
            const scene = new Scene<Item>();
            const sizes = new LiveSize({
                root: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            });
            const attr = new LiveAttributes({
                direction: 0,
                speed: 1,
            });
            const simulation = new Simulation(sizes, attr, scene);

            simulation.setup();

            // initial test
            expect(scene.length).toEqual(9);

            // update ticker
            sizes.update({ root: { width: 20, height: 20 } });
            simulation.updateSize(sizes);
            expect(scene.length).toEqual(16);

            // return back
            sizes.update({ root: { width: 10, height: 10 } });
            simulation.updateSize(sizes);
            expect(scene.length).toEqual(9);

            // update item
            sizes.update({ item: { width: 5, height: 5 } });
            simulation.updateSize(sizes);
            expect(scene.length).toEqual(16);

            // update ticker on top of item
            sizes.update({ root: { width: 20, height: 20 } });
            simulation.updateSize(sizes);
            expect(scene.length).toEqual(36);

            // return back to normal
            sizes.update({
                root: { width: 10, height: 10 },
                item: { width: 10, height: 10 },
            });
            simulation.updateSize(sizes);
            expect(scene.length).toEqual(9);
        });
    });
});
