import AbstractLink from "./AbstractLink";

export default class Link extends AbstractLink{
    static of(target: IDraggable, source: IDraggable, tR: IInput, sR: IOutput) {
        return new Link(target, source, tR, sR)
    }
}
