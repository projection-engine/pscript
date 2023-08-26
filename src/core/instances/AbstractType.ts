export default class AbstractType implements IType {
    __type: string

    getType(): string {
        return this.__type;
    }

    constructor(type: string) {
        this.__type = type
    }
}
