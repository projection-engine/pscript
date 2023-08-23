import RendererUtil from "../util/RendererUtil"
import NodeDraggable from "./NodeDraggable"
import CanvasResources from "../libs/CanvasResources"
import type Link from "./Link"
import CommentDraggable from "./CommentDraggable"
import ActionHistory from "../libs/ActionHistory"
import PScriptUtil from "../util/PScriptUtil";
import DynamicMap from "../libs/DynamicMap";
import {UUID} from "crypto";
import PScriptRendererState from "../libs/PScriptRendererState";
import AbstractDraggable from "./AbstractDraggable";

export default class RenderEngine implements IRenderEngine {
    #id: UUID
    #initialized = false
    history = new ActionHistory()
    ctx?: CanvasRenderingContext2D
    canvas?: HTMLCanvasElement
    lastSelectionListener?: Function
    selectionMap = new Map<string, AbstractDraggable>()
    #lastSelection: AbstractDraggable | undefined
    #frame: number;
    observer
    #state: RendererState<RenderEngine>

    constructor(id: UUID) {
        this.#id = id
        this.history.canvas = this
    }

    getState(){
        return this.#state ?? (this.#state = PScriptRendererState.getState(this.getId()))
    }

    initialize(canvas: HTMLCanvasElement) {
        if (this.#initialized)
            return
        this.#initialized = true
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")

        this.observer = new ResizeObserver(() => {
            const bBox = canvas.parentElement.getBoundingClientRect()
            canvas.width = bBox.width
            canvas.height = bBox.height
            canvas.style.width = bBox.width + "px"
            canvas.style.height = bBox.height + "px"
        })
        this.observer.observe(canvas.parentElement)

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

    addLink(link: Link, noUpdate?: boolean) {
        const STATE = this.#getState()
        const foundExisting = STATE.links.findIndex(l => l.input === link.input)
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

    set lastSelection(data: AbstractDraggable | undefined) {
        this.#lastSelection = data
        this.lastSelectionListener?.()
    }

    addNode(node: AbstractDraggable, noSerialization?: boolean, noUpdate?: boolean) {
        // if (!noSerialization) {
        //     this.history.save([node], true)
        //     this.history.save([node])
        // }
        const STATE = this.#getState()
        STATE.nodes.push(node)
        if (!noUpdate)
            this.clear()
    }

    removeNodes(toRemove: string[], noSerialization?: boolean) {
        const STATE = this.#getState()
        // if (!noSerialization) {
        //     const mapped = STATE.nodes.filter(e => toRemove.includes(e.id))
        //     this.history.save(mapped)
        //     this.history.save(mapped, true)
        // }
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
        const links = STATE.links
        const nodes = STATE.nodes
        for (let i = 0; i < nodes.length; i++) {
            const iDraggable = nodes[i]
            if (iDraggable instanceof CommentDraggable) {
                if (iDraggable.isOnDrag)
                    RendererUtil.drawNodePosition(ctx, iDraggable)
                iDraggable.drawToCanvas()
            }
        }

        for (let i = 0; i < links.length; i++) {
            RendererUtil.drawLink(ctx, <Link>links[i])
        }

        for (let i = 0; i < nodes.length; i++) {
            const iDraggable = nodes[i]
            if (iDraggable instanceof NodeDraggable) {
                if (iDraggable.isOnDrag)
                    RendererUtil.drawNodePosition(ctx, iDraggable)
                iDraggable.drawToCanvas()
            }
        }
    }
}
