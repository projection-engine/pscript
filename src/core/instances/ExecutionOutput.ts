import AbstractOutput from "./AbstractOutput";
import PropertyType from "./PropertyType";

export default class ExecutionOutput extends AbstractOutput {
    static of(key: string, label: string) {
        return new ExecutionOutput({
            key,
            label,
            type: PropertyType.of("EXECUTION-OUTPUT"),
            disabled: false,
            colorRGBA: [255, 255, 255, 1]
        })
    }
}
