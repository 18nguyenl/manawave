export class Container<T> implements Rect {
    private _store: Set<T>;

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this._store = new Set();

        this.width = width;
        this.height = height;
    }

    /**
     * Get an iterable of the container's current content
     */
    get contents(): IterableIterator<T> {
        return this._store.values();
    }

    /**
     * Adds a given object into the container
     * @param object object to add into the container
     */
    add(object: T) {
        this._store.add(object);
    }

    /**
     * Checks if a given object is in the container
     * @param object observed object
     * @returns if observed object is found or not
     */
    has(object: T): boolean {
        return this._store.has(object);
    }

    /**
     * Removes an object in the container.
     *
     * @remark If the object is a reference (class or object), it
     * will delete only if the reference is in the container.
     *
     * If you want to remove a matching object, use {@link find | Container.find } to
     * get these references.
     *
     * @param object an object in the container
     */
    delete(object: T) {
        this._store.delete(object);
    }

    /**
     * Finds a list of objects that match the provided predicate or criteria.
     * @param callback a predicate ran against all objects in the container
     * @returns a list of found objects
     */
    find(callback: (object: T) => boolean): T[] {
        const objects: T[] = [];
        for (const object of this._store) {
            if (callback(object)) objects.push(object);
        }

        return objects;
    }
}