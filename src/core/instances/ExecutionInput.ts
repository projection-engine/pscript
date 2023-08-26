import AbstractInput from "./AbstractInput";
import PropertyType from "./PropertyType";

export default class ExecutionInput extends AbstractInput {
    static of(key: string, label: string) {
        return new ExecutionInput({
            visibleOnNode: true,
            key,
            label,
            accept: [PropertyType.of("EXECUTION-OUTPUT")],
            disabled: false,
            colorRGBA: [255, 255, 255, 1]
        })
    }
}
