import DynamicMap from "./DynamicMap";
import CanvasRenderEngine from "../CanvasRenderEngine";

export default class CanvasStateManager {
    static #state = new DynamicMap<string, RendererState<CanvasRenderEngine>>()

    static getState(id: string) {
        return this.#state.get(id)
    }

    static createState(id: string) {
        const instance = new CanvasRenderEngine(id)
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
            smallFont: "9px Roboto",
            textColor: "#f0f0f0",
            defaultTextSize: 1,
            smallTextSize: 1,
            firstSelectionColor: "white",
            multiSelectionColor: "darkorange",
            ioTextColor: "#e0e0e0",
            tempLinkCoords: {x: 0, y: 0, startY: 0, startX: 0, color: "white"},
            drawTempLink: false,
            executionIOColor: "white"
        })
        return instance
    }

    static destroyState(id: string) {
        if (!this.#state.has(id))
            return
        const state = this.#state.get(id)
        state.getInstance().stop()
        state.getInstance().__observer.disconnect()


        this.#state.delete(id)
    }

    static setState(canvas: CanvasRenderEngine, canvasRenderEngineRendererState: RendererState<CanvasRenderEngine>) {
        this.#state.delete(canvas.getId())
        this.#state.set(canvas.getId(), canvasRenderEngineRendererState)
    }
}
