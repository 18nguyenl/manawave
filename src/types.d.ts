declare interface Dimensions {
    width: number;
    height: number;
}

declare interface DimensionsCount {
    x: number;
    y: number;
}

declare type Position = [x: number, y: number];

declare namespace Billboard {
    interface Options {
        autoplay: true | false;
    }
}
