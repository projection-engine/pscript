import AbstractType from "./AbstractType";

export default class PropertyType extends AbstractType{
    static of(str: string) {
        return new PropertyType(str)
    }
}
