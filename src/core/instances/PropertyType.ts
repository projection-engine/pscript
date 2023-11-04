import AbstractType from "./AbstractType";

export default class PropertyType extends AbstractType{
    static of(type: string, name?: string, color?: ColorRGBA) {
        const instance = new PropertyType()
        instance.from({type, color, name})
        return instance
    }
}
