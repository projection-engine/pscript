import AbstractSerializable from "./AbstractSerializable";

export default abstract class AbstractStateful<T> extends AbstractSerializable<T> implements IStateful {
    __properties: Map<string, any>;
    colorRGBA: [number, number, number, number]

    protected fromValue(colorRGBA: [number, number, number, number] ) {
        this.colorRGBA = colorRGBA
        this.__properties = new Map()
        const properties = this.getInitialProperties()
        if (properties != null) {
            Object.entries(properties).forEach(entry => {
                this.__properties.set(entry[0], entry[1])
            })
        }
    }

    abstract getInitialProperties(): MutableObject | undefined

    setProperty(key: string, value: any) {
        this.__properties.set(key, value)
    }

    getProperty(key: string) {
        return this.__properties.get(key)
    }
}
