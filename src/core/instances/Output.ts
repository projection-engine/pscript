import AbstractStateful from "./AbstractStateful";

export default class Output extends AbstractStateful implements IOutput {
    getInitialProperties(): MutableObject | undefined {
        return {};
    }

    key: string;
    label: string;
    disabled: boolean;
    type: IType;

    constructor(
        props: {
            key: string,
            label: string,
            type: IType,
            disabled: boolean
            colorRGBA?: [number, number, number, number]
        }
    ) {
        super(props.colorRGBA ?? [255, 255, 255, 1])
        this.key = props.key;
        this.label = props.label;
        this.disabled = props.disabled;
        this.type = props.type;
    }
}
