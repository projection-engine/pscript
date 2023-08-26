import AbstractStateful from "./AbstractStateful";

export default abstract class AbstractInput extends AbstractStateful implements IInput {
    getInitialProperties(): MutableObject | undefined {
        return {};
    }

    key: string;
    label: string;
    disabled: boolean;
    accept: IType[];
    /**
     * Renders input on node
     */
    visibleOnNode: boolean;

    constructor(
        props: {
            key: string,
            label: string,
            accept: IType[],
            disabled: boolean,
            visibleOnNode: boolean,
            colorRGBA?: [number, number, number, number]
        }
    ) {
        super(props.colorRGBA ?? [255, 255, 255, 1])
        this.key = props.key;
        this.visibleOnNode = props.visibleOnNode;
        this.label = props.label;
        this.disabled = props.disabled
        this.accept = props.accept
    }

    acceptsType(type: IType): boolean {
        return this.accept.findIndex(a => a.getType() === type.getType()) > -1
    }
}
