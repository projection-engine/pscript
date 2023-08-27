import AbstractLink from "./AbstractLink";
import ExecutionOutput from "./ExecutionOutput";
import ExecutionInput from "./ExecutionInput";

export default class ExecutionLink extends AbstractLink {
    static of(target: INodeDraggable, source: INodeDraggable, tR: ExecutionInput, sR: ExecutionOutput) {
        const instance = new ExecutionLink()
        instance.from({target, source, tR, sR})
        return instance
    }
}
