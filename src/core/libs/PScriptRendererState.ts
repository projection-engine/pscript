import PComment from "./PComment";
import PNode from "./PNode";
import DynamicMap from "./DynamicMap";
import {UUID} from "crypto";
import PLink from "./PLink";
import AbstractPDraggable from "./AbstractPDraggable";
import PScriptCanvas from "./PScriptCanvas";

export default class PScriptRendererState {
    static #state = new DynamicMap<UUID, {
        getId: GenericNonVoidFunction<string>,
        links: PLink[],
        nodes: AbstractPDraggable[],
        comments: PComment[],
        needsUpdate: boolean,
        getInstance: () => PScriptCanvas,
        offsetX: number,
        offsetY: number
    }>()

    static getState(id: UUID) {
        return this.#state.get(id)
    }

    static createState(id: UUID) {
        const instance = new PScriptCanvas(id)
        this.#state.set(id, {
            offsetX: 0,
            offsetY: 0,
            getId: () => id,
            links: [],
            nodes: [],
            comments: [],
            needsUpdate: false,
            getInstance: () => instance
        })
        return instance
    }

    static destroyState(id: UUID) {
        if (!this.#state.has(id))
            return
        const state = this.#state.get(id)
        state.getInstance().stop()
        state.getInstance().observer.disconnect()


        this.#state.delete(id)
    }

}
