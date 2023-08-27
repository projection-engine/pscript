import AbstractOutput from "./AbstractOutput";

export default class Output extends AbstractOutput {
    static of(props: {
        key: string,
        label: string,
        type: IType,
        disabled: boolean
        colorRGBA?: [number, number, number, number]
    }){
        const instance = new Output()
        instance.from(props)
        return instance
    }
}
