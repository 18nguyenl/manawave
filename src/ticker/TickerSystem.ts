import { Ticker, TickerItem } from ".";
import { TickerStore } from "../data";
import TickerItemFactory from "./TickerItemFactory";

export default class TickerSystem {
    private _ticker: Ticker;
    private _tickerItemStore: TickerStore;
    private _tickerItemFactory: TickerItemFactory;

    constructor(element: HTMLElement) {
        this._ticker = new Ticker(element);
        this._tickerItemStore = new TickerStore();

        this._tickerItemFactory = new TickerItemFactory(
            this._tickerItemStore,
            this._ticker
        );
    }

    fill() {
        this.clear();

        const initialSequence: TickerItem[] =
            this._tickerItemFactory.sequence();
        const sequenceDimensions = initialSequence.reduce(
            (accum: Dimensions, curr: TickerItem) => {
                const currDimensions = curr.dimensions;

                return {
                    width: accum.width + currDimensions.width,
                    height: Math.max(accum.height, currDimensions.height),
                };
            },
            { width: 0, height: 0 }
        );
        const repetition = {
            x:
                Math.round(
                    this._ticker.dimensions.width / sequenceDimensions.width
                ) + 2,
            y:
                Math.round(
                    this._ticker.dimensions.height / sequenceDimensions.height
                ) + 2,
        };
        const position: Position = [
            -sequenceDimensions.width,
            -sequenceDimensions.height,
        ];

        const tickerItems = initialSequence.concat(
            this._tickerItemFactory.create(repetition.x * repetition.y - 1)
        );

        // iterate through clones and properly set the positions
        let clonesIndex = 0;
        let currItem = tickerItems[clonesIndex];
        for (let i = 0; i < repetition.y; i++) {
            for (let j = 0; j < repetition.x; j++) {
                currItem = tickerItems[clonesIndex];
                const { width: itemWidth, height: itemHeight } =
                    currItem.dimensions;

                currItem.position = [
                    position[0] + j * itemWidth,
                    position[1] + i * itemHeight,
                ];
                clonesIndex++;
            }
        }
    }

    // remove all clones
    clear() {
        for (const item of this._tickerItemStore.allTickerItems) {
            item.remove();
        }

        this._ticker.height = -1;
    }

    load() {
        this._ticker.load();
        if (this._tickerItemFactory.templateIsEmpty)
            this._tickerItemFactory.addTemplate(this._ticker.initialTemplate!);
        this.fill();
    }

    unload() {
        this.clear();
        this._tickerItemFactory.clearTemplates();
        this._ticker.unload();
    }
}