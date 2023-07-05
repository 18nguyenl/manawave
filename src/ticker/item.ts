import { uid } from "@ouroboros/utils/uid";
import { normalize } from "./math";

export class Item implements Positionable {
    id: string;
    lifetime: DOMHighResTimeStamp;
    position: vec2;
    size: Rect;

    constructor(position?: vec2, size?: Rect) {
        this.lifetime = 0;
        this.position = {
            x: 0,
            y: 0,
        };
        this.size = {
            width: 0,
            height: 0,
        };

        if (position) this.position = position;
        if (size) this.size = size;

        this.id = uid();
    }

    /**
     * Moves an item towards somewhere.
     * @param direction direction to move
     * @param speed how fast or strongly the item should move
     */
    move(direction: vec2, speed: number) {
        // directions should not have any magnitude and should be normalized
        const normalizedDirection = normalize(direction);

        this.position.x += 1 * speed * normalizedDirection.x;
        this.position.y += 1 * speed * normalizedDirection.y;
    }

    /**
     * This will loop (change the position) an {@link Item} from one end to the other end
     * of a rectangle. In more technical terms, it adjusts the position of
     * an {@link Item} to fit inside the rectangle, looping the item to fit it in.
     * @param itemSize the current size of the item
     * @param limits the rectangle to loop around
     * @param direction the actual direction / motion of the item
     */
    loop(limits: DirectionalCount, direction: vec2) {
        if (direction.x > 0 && this.position.x >= limits.horizontal) {
            this.position.x = -this.size.width;
        } else if (direction.x < 0 && this.position.x <= -this.size.width) {
            this.position.x = limits.horizontal;
        }
        if (direction.y > 0 && this.position.y >= limits.vertical) {
            this.position.y = -this.size.height;
        } else if (direction.y < 0 && this.position.y <= -this.size.height) {
            this.position.y = limits.vertical;
        }
    }
}
