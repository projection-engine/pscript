import AbstractType from "./AbstractType";

export default class NodeType extends AbstractType{
    static of(type: string) {
        const instance = new NodeType()
        instance.from({type})
        return instance
    }
}
