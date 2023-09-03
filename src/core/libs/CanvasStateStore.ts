import AbstractStore from "./AbstractStore"
import CanvasRenderEngine from "../CanvasRenderEngine";

export default class CanvasStateStore extends AbstractStore {
    static silentlyUpdateProperty(instanceId: string, key: string, value: any) {
        const state = this.getDataById(instanceId)

        if (state != null) {
            state[key] = value
        }
    }

    static updateProperty(instanceId: string, key: string, value: any) {
        const state = this.getDataById(instanceId)
        if (state != null) {
            state[key] = value
            this.updateStore({[instanceId]: state})
        }
    }

    static createState(id: string) {
        const instance = new CanvasRenderEngine(id)
        this.updateStore({
            [id]: {
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
                defaultTextSize: 1,
                smallTextSize: 1,
                tempLinkCoords: {x: 0, y: 0, startY: 0, startX: 0, color: "white"},
                drawTempLink: false,
                selected: new Map<string, IDraggable>(),
                lastSelection: undefined,
                variableNames: {}
            }
        })
        return instance
    }

    static getDataById(id: string): RendererState<CanvasRenderEngine> | undefined {
        return this.getData()[id]
    }

    static triggerDelayedUpdate(instanceId: string) {
        const state = this.getDataById(instanceId)
        if (state != null) {
            this.updateStore({[instanceId]: state})
        }
    }

    static destroyState(id: string) {
        const data = this.getData()
        const current = data[id] as RendererState<CanvasRenderEngine>
        if (current != null) {
            current.getInstance().stop()
            current.getInstance().__observer.disconnect()
            delete data[id]
            this.updateStore(data)
        }
    }

}

