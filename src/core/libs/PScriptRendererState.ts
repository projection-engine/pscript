import CommentDraggable from "../instances/CommentDraggable";
import NodeDraggable from "../instances/NodeDraggable";
import DynamicMap from "./DynamicMap";
import {UUID} from "crypto";
import Link from "../instances/Link";
import AbstractDraggable from "../instances/AbstractDraggable";
import RenderEngine from "../instances/RenderEngine";

export default class PScriptRendererState {
    static #state = new DynamicMap<UUID, RendererState<RenderEngine>>()

    static getState(id: UUID) {
        return this.#state.get(id)
    }

    static createState(id: UUID) {
        const instance = new RenderEngine(id)
        this.#state.set(id, {
            offsetX: 0,
            offsetY: 0,
            getId: () => id,
            links: [],
            nodes: [],
            needsUpdate: false,
            getInstance: () => instance,
            grid: 20,
            scale: 1,
            backgroundColor: "#292929",
            rectColor: "#353535",
            borderColor: "#6b6b6b"
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
