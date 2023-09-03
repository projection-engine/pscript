import RendererUtil from "./util/RendererUtil"
import type AbstractLink from "./instances/AbstractLink"
import PScriptUtil from "./util/PScriptUtil";
import IDraggableUtil from "./util/IDraggableUtil";
import CanvasStateStore from "./libs/CanvasStateStore";
import GlobalStyles from "./resources/GlobalStyles";

export default class CanvasRenderEngine implements IRenderEngine {
    #id: string
    #initialized = false
    __ctx: CanvasRenderingContext2D
    __canvas: HTMLCanvasElement
    #frame: number;
    __observer: ResizeObserver
    #state: RendererState<CanvasRenderEngine>

    constructor(id: string) {
        this.#id = id
        // this.history.canvas = this
    }

    getState(): RendererState<CanvasRenderEngine> {
        return this.#state ?? (this.#state = CanvasStateStore.getDataById(this.getId()))
    }

    clearState() {
        this.#state = undefined
        CanvasStateStore.updateStore({
            selected: new Map<string, IDraggable>(),
            lastSelection: undefined,
            focusedFunction: undefined
        })
    }

    initialize(canvas: HTMLCanvasElement) {
        if (this.#initialized)
            return
        this.#initialized = true
        this.__canvas = canvas
        this.__ctx = canvas.getContext("2d")

        this.__observer = new ResizeObserver(() => {
            const bBox = canvas.parentElement.getBoundingClientRect()
            canvas.width = bBox.width
            canvas.height = bBox.height
            canvas.style.width = bBox.width + "px"
            canvas.style.height = bBox.height + "px"
            this.#state.needsUpdate = true
        })
        this.__observer.observe(canvas.parentElement)

        canvas.addEventListener("contextmenu", e => e.preventDefault())
        canvas.addEventListener("mousedown", IDraggableUtil.getMousedownEvent(this))
        canvas.addEventListener("wheel", PScriptUtil.getCanvasZoomEvent(this), {passive: false})
        this.start()
    }

    private findTextDimensions() {
        const state = this.getState()
        this.__ctx.font = GlobalStyles.defaultFont
        state.defaultTextSize = this.__ctx.measureText("T").width

        this.__ctx.font = GlobalStyles.smallFont
        state.smallTextSize = this.__ctx.measureText("T").width
    }

    start() {
        if (this.#frame)
            return
        this.clear()
        this.findTextDimensions()
        this.#frame = requestAnimationFrame(() => this.#loop())
    }

    stop() {
        cancelAnimationFrame(this.#frame)
        this.#frame = undefined
    }

    #loop() {
        const STATE = this.getState()
        if (!STATE)
            return;
        if (STATE.needsUpdate) {
            const ctx = this.__ctx
            if (!ctx)
                return
            const canvas = this.__canvas
            const scale = STATE.scale || .01

            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.setTransform(scale, 0, 0, scale, 0, 0)
            this.#draw()
            STATE.needsUpdate = false
        }
        this.#frame = requestAnimationFrame(() => this.#loop())
    }

    getId() {
        return this.#id
    }

    clear() {
        this.getState().needsUpdate = true
    }

    #draw() {
        const ctx = this.__ctx
        const STATE = this.getState()
        const links = STATE.links
        const nodes = STATE.nodes
        const comments = STATE.comments
        const functions = STATE.functions

        for (let i = 0; i < functions.length; i++) {
            const comment = comments[i]
            if (comment.isOnDrag)
                RendererUtil.drawDraggablePosition(ctx, comment)
            comment.drawToCanvas()
        }

        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i]
            if (comment.isOnDrag)
                RendererUtil.drawDraggablePosition(ctx, comment)
            comment.drawToCanvas()
        }

        for (let i = 0; i < links.length; i++) {
            RendererUtil.drawLink(ctx, <AbstractLink>links[i])
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            if (node.isOnDrag)
                RendererUtil.drawDraggablePosition(ctx, node)
            node.drawToCanvas()
        }

        if (STATE.drawTempLink) {
            const coords = STATE.tempLinkCoords
            ctx.strokeStyle = coords.color
            RendererUtil.drawBezierCurve(ctx, coords.startX, coords.x, coords.startY, coords.y)
            STATE.drawTempLink = false
        }
    }
}
