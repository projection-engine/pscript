import AbstractOutput from "./AbstractOutput";

export default class Output extends AbstractOutput {
    static of(props: {
        key: string,
        label: string,
        type: IType,
        disabled: boolean
        colorRGBA?: ColorRGBA
    }){
        const instance = new Output()
        instance.from(props)
        return instance
    }
}
