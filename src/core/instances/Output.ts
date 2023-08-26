import AbstractLink from "./AbstractLink";
import AbstractOutput from "./AbstractOutput";
import AbstractInput from "./AbstractInput";

export default class Output extends AbstractOutput {
    static of(props: {
        key: string,
        label: string,
        type: IType,
        disabled: boolean
        colorRGBA?: [number, number, number, number]
    }){
        return new Output(props)
    }
}
