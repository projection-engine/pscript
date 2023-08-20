import CanvasRenderer from "./CanvasRenderer"
import type PNode from "./PNode"
import CanvasResources from "./CanvasResources"
import type PLink from "./PLink"
import type PComment from "./PComment"
import ShaderEditorActionHistory from "./ShaderEditorActionHistory"
import PScriptUtil from "./PScriptUtil";
import DynamicMap from "./DynamicMap";
import {UUID} from "crypto";
import PScriptRendererState from "./PScriptRendererState";
import AbstractPDraggable from "./AbstractPDraggable";

export default class PScriptCanvas {
    #id: UUID
    #initialized = false
    history = new ShaderEditorActionHistory()
    ctx?: CanvasRenderingContext2D
    canvas?: HTMLCanvasElement
    lastSelectionListener?: Function
    selectionMap = new Map<string, AbstractPDraggable>()
    #lastSelection: AbstractPDraggable | undefined
    #frame: number;

    constructor(id: UUID) {
        this.#id = id
        this.history.canvas = this
    }

    initialize(canvas: HTMLCanvasElement) {
        if (this.#initialized)
            return
        this.#initialized = true
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.canvas.width = CanvasResources.width
        this.canvas.height = CanvasResources.height
        this.canvas.style.width = CanvasResources.width + "px"
        this.canvas.style.height = CanvasResources.height + "px"
        canvas.addEventListener("contextmenu", e => e.preventDefault())
        canvas.addEventListener("mousedown", PScriptUtil.getMousedownEvent(this))
        canvas.addEventListener("wheel", PScriptUtil.getCanvasZoomEvent(this), {passive: false})
        this.clear()
        this.#frame = requestAnimationFrame(() => this.#loop())
    }

    stop() {
        cancelAnimationFrame(this.#frame)
    }

    #loop() {
        const STATE = this.#getState()
        if (!STATE)
            return;
        if (STATE.needsUpdate) {
            const ctx = this.ctx
            if (!ctx)
                return
            const canvas = this.canvas
            const scale = CanvasResources.scale || .01

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

    addLink(link: PLink, noUpdate?: boolean) {
        const STATE = this.#getState()
        const foundExisting = STATE.links.findIndex(l => l.targetRef === link.targetRef)
        if (foundExisting > -1)
            STATE.links[foundExisting] = link
        else
            STATE.links.push(link)
        if (!noUpdate)
            this.clear()
    }

    removeLink(index: number) {
        const STATE = this.#getState()
        STATE.links.splice(index, 1)
        this.clear()
    }

    get lastSelection() {
        return this.#lastSelection
    }

    set lastSelection(data: AbstractPDraggable | undefined) {
        this.#lastSelection = data
        this.lastSelectionListener?.()
    }

    addNode(node: AbstractPDraggable, noSerialization?: boolean, noUpdate?: boolean) {
        if (!noSerialization) {
            this.history.save([node], true)
            this.history.save([node])
        }
        const STATE = this.#getState()
        STATE.nodes.push(node)
        if (!noUpdate)
            this.clear()
    }

    removeNodes(toRemove: string[], noSerialization?: boolean) {
        const STATE = this.#getState()
        if (!noSerialization) {
            const mapped = STATE.nodes.filter(e => toRemove.includes(e.id))
            this.history.save(mapped)
            this.history.save(mapped, true)
        }
        for (let i = 0; i < toRemove.length; i++) {
            const id = toRemove[i];
            const index = STATE.nodes.findIndex(n => n.id === id)
            if (index > -1) {
                STATE.nodes.splice(index, 1)
                const toRemove = STATE.links.filter(l => l.sourceNode?.id === id || l.targetNode?.id === id)
                toRemove.forEach(l => {
                    this.removeLink(STATE.links.indexOf(l))
                })
            }
        }
        this.clear()
    }


    clear() {
        this.#getState().needsUpdate = true
    }

    #draw() {
        const ctx = this.ctx
        const STATE = this.#getState()
        const comments = STATE.comments
        const links = STATE.links
        const nodes = STATE.nodes

        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i]
            if (comment.isOnDrag)
                CanvasRenderer.drawNodePosition(ctx, comment)
            comment.drawToCanvas(ctx, this)
        }

        for (let i = 0; i < links.length; i++) {
            CanvasRenderer.drawLink(ctx, links[i])
        }

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            if (node.isOnDrag)
                CanvasRenderer.drawNodePosition(ctx, node)
            node.drawToCanvas(ctx, this)
        }
    }
}
