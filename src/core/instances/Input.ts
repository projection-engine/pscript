import AbstractInput from "./AbstractInput";

export default class Input extends AbstractInput {
    static of(props: {
        key: string,
        label: string,
        accept: IType[],
        disabled: boolean,
        visibleOnNode: boolean,
        colorRGBA?: ColorRGBA
    }) {
        const instance = new Input()
        instance.from(props)
        return instance
    }
}
