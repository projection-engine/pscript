import RendererUtil from "./util/RendererUtil"
import AbstractNode from "./instances/AbstractNode"
import type AbstractLink from "./instances/AbstractLink"
import Comment from "./instances/Comment"
import ActionHistory from "./libs/ActionHistory"
import PScriptUtil from "./util/PScriptUtil";
import PScriptRendererState from "./libs/PScriptRendererState";
import AbstractDraggable from "./instances/AbstractDraggable";
import IDraggableUtil from "./util/IDraggableUtil";

export default class CanvasRenderEngine implements IRenderEngine {
    #id: string
    #initialized = false
    //history = new ActionHistory()
    __ctx: CanvasRenderingContext2D
    __canvas: HTMLCanvasElement
    __lastSelectionListener?: Function
    __selectionMap = new Map<string, IDraggable>()
    #lastSelection: IDraggable
    #frame: number;
    __observer
    #state: RendererState<CanvasRenderEngine>

    constructor(id: string) {
        this.#id = id
        // this.history.canvas = this
    }

    getState(): RendererState<CanvasRenderEngine> {
        return this.#state ?? (this.#state = PScriptRendererState.getState(this.getId()))
    }

    clearState() {
        this.#state = undefined
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
        this.__ctx.font = state.defaultFont
        state.defaultTextSize = this.__ctx.measureText("T").width

        this.__ctx.font = state.smallFont
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
        const STATE = this.#getState()
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

    #getState() {
        return PScriptRendererState.getState(this.getId())
    }

    addLink(link: AbstractLink, noUpdate?: boolean) {
        const foundExisting = this.#state.links.findIndex(l => l.input === link.input)
        if (foundExisting > -1)
            this.#state.links[foundExisting] = link
        else
            this.#state.links.push(link)
        if (!noUpdate)
            this.clear()
    }

    removeLink(index: number) {
        this.#state.links.splice(index, 1)
        this.clear()
    }

    get lastSelection() {
        return this.#lastSelection
    }

    set lastSelection(data: IDraggable) {
        this.#lastSelection = data
        this.__lastSelectionListener?.()
    }

    addDraggable(node: IDraggable) {
        // if (!noSerialization) {
        //     this.history.save([node], true)
        //     this.history.save([node])
        // }
        const state = this.getState()
        if (node instanceof Comment) {
            state.comments.push(node)
        } else {
            state.nodes.push(<AbstractNode>node)
        }
        this.clear()
    }

    removeDraggable(toRemove: AbstractDraggable[]) {
        // if (!noSerialization) {
        //     const mapped = STATE.nodes.filter(e => toRemove.includes(e.id))
        //     this.history.save(mapped)
        //     this.history.save(mapped, true)
        // }
        for (let i = 0; i < toRemove.length; i++) {
            const draggable = toRemove[i];
            if (draggable instanceof AbstractNode) {
                const index = this.#state.nodes.indexOf(draggable)
                if (index > -1) {
                    this.#state.nodes.splice(index, 1)
                    const toRemove = this.#state.links.filter(l => l.sourceNode === draggable || l.targetNode === draggable)
                    toRemove.forEach(l => {
                        this.removeLink(this.#state.links.indexOf(l))
                    })
                }
            } else {
                const index = this.#state.comments.indexOf(draggable)
                this.#state.comments.splice(index, 1)
            }
        }
        this.clear()
    }


    clear() {
        this.#getState().needsUpdate = true
    }

    #draw() {
        const ctx = this.__ctx
        const STATE = this.#getState()
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
