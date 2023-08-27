import AbstractSerializable from "./AbstractSerializable";

export default class AbstractType extends AbstractSerializable<{type: string}> implements IType {
    _type: string

    getType(): string {
        return this._type;
    }

    from(props) {
        this._type = props.type
    }
}
