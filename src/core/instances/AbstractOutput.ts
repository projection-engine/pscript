import AbstractStateful from "./AbstractStateful";

export default abstract class AbstractOutput extends AbstractStateful implements IOutput {
    getInitialProperties(): MutableObject | undefined {
        return {};
    }

    key: string;
    label: string;
    disabled: boolean;
    hideLabel: boolean = false
    type: IType;

    protected constructor(
        props: {
            key: string;
            label: string;
            type: IType;
            disabled: boolean;
            hideLabel?: boolean;
            colorRGBA?: [number, number, number, number];
        }
    ) {
        super(props.colorRGBA ?? [255, 255, 255, 1])
        this.hideLabel = props.hideLabel ?? false
        this.key = props.key;
        this.label = props.label;
        this.disabled = props.disabled;
        this.type = props.type;
    }

}
