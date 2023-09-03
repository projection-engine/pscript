import AbstractSerializable from "./AbstractSerializable";

export default class AbstractType extends AbstractSerializable<{ type: string, color?: ColorRGBA }> implements IType {
    _type: string
    _color: ColorRGBA

    getType(): string {
        return this._type;
    }

    from(props) {
        this._type = props.type
        this._color = props.color ?? [0, 0, 0, 0]
    }

    getColor(): ColorRGBA {
        return this._color;
    }
}
