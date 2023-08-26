import AbstractLink from "./AbstractLink";
import ExecutionOutput from "./ExecutionOutput";
import ExecutionInput from "./ExecutionInput";

export default class ExecutionLink extends AbstractLink{
    static of(target: IDraggable, source: IDraggable, tR: ExecutionInput, sR: ExecutionOutput) {
        return new ExecutionLink(target, source, tR, sR)
    }
}
