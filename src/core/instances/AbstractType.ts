import AbstractSerializable from "./AbstractSerializable";

type P = { name?: string, type: string, color?: ColorRGBA }
export default class AbstractType extends AbstractSerializable<P> implements IType {

    _type: string
    _color?: ColorRGBA
    _name?: string;

    getType(): string {
        return this._type;
    }

    from(props: P) {
        this._type = props.type
        this._name = props.name
        this._color = props.color ?? [0, 0, 0, 0]
    }

    getColor(): ColorRGBA {
        return this._color;
    }

    getName(): string {
        return this._name;
    }
}
