import AbstractLink from "./AbstractLink";

export default class Link extends AbstractLink{
    static of(target: INodeDraggable, source: INodeDraggable, tR: IInput, sR: IOutput) {
        const instance = new Link()
        instance.from({target, source, tR, sR})
        return instance
    }
}
