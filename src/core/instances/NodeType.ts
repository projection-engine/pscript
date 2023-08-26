import AbstractType from "./AbstractType";

export default class NodeType extends AbstractType{
    static of(str: string) {
        return new NodeType(str)
    }
}
