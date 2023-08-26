import AbstractInput from "./AbstractInput";

export default class Input extends AbstractInput {
    static of(props: {
        key: string,
        label: string,
        accept: IType[],
        disabled: boolean,
        visibleOnNode: boolean,
        colorRGBA?: [number, number, number, number]
    }) {
        return new Input(props)
    }
}
