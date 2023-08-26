import DynamicMap from "./DynamicMap";
import {UUID} from "crypto";
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
            functions: [],
            comments: [],
            needsUpdate: false,
            getInstance: () => instance,
            grid: 20,
            scale: 1,
            backgroundColor: "#292929",
            rectColor: "#353535",
            borderColor: "#6b6b6b",
            defaultFont: "10px Roboto",
            smallFont: "8px Roboto",
            textColor: "#f0f0f0",
            defaultTextSize: 1,
            smallTextSize: 1,
            firstSelectionColor: "white",
            multiSelectionColor: "darkorange",
            ioTextColor: "#999",
            tempLinkCoords: {x: 0, y: 0, startY: 0, startX: 0},
            drawTempLink: false
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
