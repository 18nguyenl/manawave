import Square from "test/pages/square/Square";
import AnimationController from "../AnimationController";
import { setTranslate } from "@billboard/dom";
import DOMAnimationObject from "../DOMAnimationObject";

function getPositionFromMatrix(matrix: string): Position {
    const parsed = matrix.match(/-?\d+/g)!;

    return [parseFloat(parsed[4]), parseFloat(parsed[5])];
}

describe("animation system", () => {
    beforeEach(() => {
        Square.loadContent();
        setTranslate(Square.square, [0, 0]);
    });
    afterEach(() => {
        Square.clearContent();
    });

    it("should animate horizontally", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        const animationController = new AnimationController();
        const animObject = new DOMAnimationObject(999, Square.square);
        animObject.position = [0, 0];
        animObject.destination = [DESTINATION, 0];
        animationController.addAnimation(animObject);

        animationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[0] >= DESTINATION) return position[0];
        });

        expect(result).toBeCloseTo(DESTINATION);

        animationController.stop();

        DESTINATION = -100;
        animObject.destination[0] = DESTINATION;
        animationController.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[0] <= DESTINATION) return position[0];
        });

        expect(result).toBeCloseTo(DESTINATION);
    });

    it("should animate vertically", async () => {
        let DESTINATION = 100;
        const element = await $("#square");

        let animationController = new AnimationController();
        const animObject = new DOMAnimationObject(999, Square.square);
        animObject.position = [0, 0];
        animObject.destination = [0, DESTINATION];
        animationController.addAnimation(animObject);

        animationController.start();

        let result;

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[1] >= DESTINATION) return position[1];
        });

        expect(result).toBeCloseTo(DESTINATION);

        animationController.stop();

        DESTINATION = -100;
        animObject.destination[1] = DESTINATION;
        animationController.start();

        result = await browser.waitUntil(async () => {
            const transform = await element.getCSSProperty("transform");
            const position = getPositionFromMatrix(transform.value!);

            if (position[1] <= DESTINATION) return position[1];
        });

        expect(result).toBeCloseTo(DESTINATION);
    });
});