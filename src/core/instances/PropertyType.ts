import AbstractType from "./AbstractType";

export default class PropertyType extends AbstractType{
    static of(type: string) {
        const instance = new PropertyType()
        instance.from({type})
        return instance
    }
}
