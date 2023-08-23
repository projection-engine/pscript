export default class AbstractIO implements IO {
    __properties: Map<string, any>;

    constructor(properties: MutableObject | undefined) {
        this.__properties = new Map()
        if (properties != null) {
            Object.entries(properties).forEach(entry => {
                this.__properties.set(entry[0], entry[1])
            })
        }
    }

    setProperty(key: string, value: any) {
        this.__properties.set(key, value)
    }

    getProperty(key: string) {
        return this.__properties.get(key)
    }

    getColor(): [number, number, number] {
        return [255, 255, 255];
    }
}
