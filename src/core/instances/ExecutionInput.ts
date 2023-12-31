import AbstractInput from "./AbstractInput";
import PropertyType from "./PropertyType";

export default class ExecutionInput extends AbstractInput {
    static of(key: string, label: string, showLabel?: boolean) {
        const instance = new ExecutionInput()
        instance.from({
            visibleOnNode: true,
            key,
            label,
            accept: [PropertyType.of("EXECUTION-OUTPUT")],
            disabled: false,
            colorRGBA: [255, 255, 255, 1],
            hideLabel: !showLabel
        })
        return instance
    }
}
