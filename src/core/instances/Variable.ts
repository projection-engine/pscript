export default class Variable implements IVariable{
    _name: string;
    _type: IType;

    constructor(name: string, type: IType) {
        this._name = name
        this._type = type
    }

    getName(): string {
        return this._name
    }

    getType(): IType {
        return this._type;
    }
}
