import IO_RADIUS from "../resources/IO_RADIUS"
import HEADER_HEIGHT from "../resources/HEADER_HEIGHT"
import type AbstractDraggable from "../instances/AbstractDraggable"
import type NodeDraggable from "../instances/NodeDraggable"
import RendererUtil from "./RendererUtil";
import CommentDraggable from "../instances/CommentDraggable";
import RenderEngine from "../instances/RenderEngine";
import PScriptUtil from "./PScriptUtil";

const types = {
    vec2: 0,
    vec3: 1,
    vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export default class IDraggableUtil {

    static getMinimalType(...typesToCompare): string | undefined {
        const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
        return typesInverted[min]
    }

    static getIOColor(attribute: IO, isSomeoneDisabled: boolean) {
        return `rgba(${attribute.getColor()},${isSomeoneDisabled ? .5 : 1})`
    }

    static getIOPosition(index: number, node: NodeDraggable, asOutput: boolean): {
        x: number,
        y: number,
        height: number,
        width: number,
        rowY: number
    } {
        const coord = node.getTransformedCoordinates()

        const xN = coord.x, yN = coord.y, w = node.width
        const H = HEADER_HEIGHT - 5
        const Y = yN + H * (index + 2)
        const xIO = !asOutput ? xN : xN + w
        const yIO = Y - IO_RADIUS


        return {x: xIO, y: yIO, height: H, width: w, rowY: Y}
    }

    static drag(
        event: MouseEvent,
        draggable: IDraggable,
        parentBbox: { left: number, top: number },
        asPositionChange: boolean): {
        onMouseMove: Function,
        node: IDraggable
    } {
        const state = draggable.__canvas.getState()
        const bounding = {
            x: !asPositionChange ? 0 : draggable.x * state.scale - event.clientX,
            y: !asPositionChange ? 0 : draggable.y * state.scale - event.clientY
        }
        if (!asPositionChange) {
            bounding.x -= parentBbox.left
            bounding.y -= parentBbox.top
        }
        return {
            node: draggable,
            onMouseMove: ev => {
                let X = Math.round(((ev.clientX + bounding.x) / state.scale) / state.grid) * state.grid
                let Y = Math.round(((ev.clientY + bounding.y) / state.scale) / state.grid) * state.grid
                if (asPositionChange) {
                    draggable.x = X
                    draggable.y = Y
                } else {
                    X -= draggable.x
                    Y -= draggable.y
                    if (X > draggable.getMinWidth()) {
                        draggable.width = X - state.offsetX
                    }
                    if (Y > draggable.getMinHeight()) {
                        draggable.height = Y - state.offsetY
                    }
                }

            }
        }
    }

    static onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI: RenderEngine, parentBBox, parentElement: HTMLElement, event: MouseEvent) {
        const state = canvasAPI.getState()
        const nodes = <NodeDraggable[]>state.nodes
        const comments = <CommentDraggable[]>state.comments
        const links = state.links

        const X = (event.clientX - BBox.x) / state.scale
        const Y = (event.clientY - BBox.y) / state.scale

        if (!event.ctrlKey) {
            canvasAPI.lastSelection = undefined
            canvasAPI.selectionMap.clear()
        } else
            canvasAPI.selectionMap.forEach(node => {
                nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
            })
        let executionBroken = false

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i]
            const onBody = node.checkBodyClick(X, Y)
            const onHeader = node.checkHeaderClick(X, Y)
            if (onHeader || onBody) {
                canvasAPI.selectionMap.set(node.id, node)
                canvasAPI.lastSelection = node
                if (onHeader) {
                    nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
                    node.isOnDrag = true
                } else if (!event.ctrlKey) {
                    const isOnScale = node.checkAgainstScale(X, Y)
                    if (isOnScale) {
                        nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, false))
                        node.isOnDrag = true
                    } else {
                        const output = node.checkAgainstIO<IOutput>(X, Y)
                        if (output != null) {
                            this.processOutputClick(IO, node, output, tempLink);
                        } else {
                            const input = node.checkAgainstIO<IInput>(X, Y, true)
                            if (!input) {
                                executionBroken = true
                                break
                            }
                            const F = links.findIndex(l => l.input === input)
                            if (F === -1) {
                                executionBroken = true
                                break
                            }
                            this.processInputClick(links, F, IO, canvasAPI, tempLink, event, parentElement, parentBBox);
                        }
                    }
                }
                executionBroken = true
                break
            }
        }

        if (!executionBroken) {
            for (let i = comments.length - 1; i >= 0; i--) {
                const comment = comments[i]
                const onBody = comment.checkBodyClick(X, Y)
                const onHeader = comment.checkHeaderClick(X, Y)
                if (onHeader || onBody) {
                    this.processCommentClick(onHeader, nodesOnDrag, event, comment, parentBBox, X, Y, canvasAPI);
                    break
                }
            }
        }

        if (nodesOnDrag.length > 0 || IO.node !== undefined)
            canvasAPI.ctx.canvas.style.cursor = "grabbing"
        canvasAPI.clear()
    }

    private static processOutputClick(IO, node: NodeDraggable, output: IOutput, tempLink) {
        IO.node = node
        IO.output = output
        const position = IDraggableUtil.getIOPosition(node.outputs.indexOf(output), node, true)
        tempLink.x = position.x
        tempLink.y = position.y
    }

    private static processInputClick(links: ILink[], F: number, IO, canvasAPI: RenderEngine, tempLink, event: MouseEvent, parentElement: HTMLElement, parentBBox) {
        const found = links[F]
        const originalPosition = IDraggableUtil.getIOPosition((<NodeDraggable>found.sourceNode).outputs.indexOf(found.output), <NodeDraggable>found.sourceNode, true)
        IO.node = found.sourceNode
        IO.output = found.output

        canvasAPI.removeLink(F)

        tempLink.x = originalPosition.x
        tempLink.y = originalPosition.y
        RendererUtil.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
    }

    private static processCommentClick(onHeader: boolean, nodesOnDrag, event: MouseEvent, comment: CommentDraggable, parentBBox, X: number, Y: number, canvasAPI: RenderEngine) {
        if (onHeader) {
            nodesOnDrag.push(IDraggableUtil.drag(event, comment, parentBBox, true))
            comment.isOnDrag = true
        } else if (!event.ctrlKey) {
            const isOnScale = comment.checkAgainstScale(X, Y)
            if (isOnScale) {
                nodesOnDrag.push(IDraggableUtil.drag(event, comment, parentBBox, false))
                comment.isOnDrag = true
            }
        }
        canvasAPI.selectionMap.set(comment.id, comment)
        canvasAPI.lastSelection = comment
    }

    static #checkOffset(ev1: MouseEvent, ev2: { x: number, y: number }): boolean {
        return Math.abs(ev1.clientX - ev2.x) < 10 && Math.abs(ev1.clientY - ev2.y) < 10
    }


    static getMousedownEvent(canvasAPI: RenderEngine): (this: HTMLCanvasElement, ev: WheelEvent) => void {
        const state = canvasAPI.getState()

        const nodesOnDrag: { onMouseMove: Function, node: AbstractDraggable }[] = []
        const IO: { node: NodeDraggable | undefined, output: IOutput | undefined } = {
            node: undefined,
            output: undefined
        }
        const parentElement = canvasAPI.canvas.parentElement
        const tempLink = {x: 0, y: 0, x1: 0, y1: 0}
        const executionState = {
            parentBBox: DOMRect = undefined,
            isOnScroll: false
        }
        const initialClick = {x: 0, y: 0}
        let totalScrolledX = state.offsetX
        let totalScrolledY = state.offsetY
        const handleMouseMove = (event: MouseEvent) => {
            IDraggableUtil.onMouseMove(executionState, totalScrolledY, event, totalScrolledX, state, nodesOnDrag, IO, parentElement, tempLink, canvasAPI);
        }

        return (mouseDownEvent: MouseEvent) => {
            this.executeMouseEvent(mouseDownEvent, canvasAPI, initialClick, executionState, parentElement, IO, tempLink, nodesOnDrag, handleMouseMove);
        }
    }

    private static executeMouseEvent(
        mouseDownEvent: MouseEvent,
        canvasAPI: RenderEngine,
        initialClick: { x: number; y: number },
        executionState: { parentBBox: DOMRect; isOnScroll: boolean },
        parentElement: HTMLElement,
        IO: { node?: NodeDraggable; output?: IOutput },
        tempLink: { x: number; y1: number; y: number; x1: number },
        nodesOnDrag: { onMouseMove: Function; node: AbstractDraggable }[],
        handleMouseMove: (event: MouseEvent) => void
    ) {
        if (mouseDownEvent.target !== canvasAPI.canvas)
            return
        initialClick.x = mouseDownEvent.clientX
        initialClick.y = mouseDownEvent.clientY
        const BBox = canvasAPI.canvas.getBoundingClientRect()
        executionState.parentBBox = parentElement.getBoundingClientRect()
        executionState.isOnScroll = mouseDownEvent.button === 2

        if (!executionState.isOnScroll)
            IDraggableUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, executionState.parentBBox, parentElement, mouseDownEvent)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", mouseUpEvent => {
            if (IO.node !== undefined) PScriptUtil.handleLink(canvasAPI, mouseUpEvent, BBox.x, BBox.y, IO.node, IO.output)

            if (executionState.isOnScroll && IDraggableUtil.#checkOffset(mouseUpEvent, initialClick))
                IDraggableUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, executionState.parentBBox, parentElement, mouseUpEvent)
            IO.node = undefined
            IO.output = undefined
            tempLink.x = tempLink.y = tempLink.x1 = tempLink.y1 = 0

            for (let i = 0; i < nodesOnDrag.length; i++) {
                nodesOnDrag[i].node.isOnDrag = false
            }
            nodesOnDrag.length = 0
            document.removeEventListener("mousemove", handleMouseMove)
            canvasAPI.clear()
            canvasAPI.canvas.style.cursor = "default"
        }, {once: true})
    }

    private static onMouseMove(
        executionState: { isOnScroll: boolean, parentBBox: DOMRect },
        totalScrolledY: number,
        event: MouseEvent, totalScrolledX: number,
        state: RendererState<RenderEngine>,
        nodesOnDrag: { onMouseMove: Function; node: AbstractDraggable }[],
        IO: { node?: NodeDraggable; output?: IOutput },
        parentElement: HTMLElement,
        tempLink: { x: number; y1: number; y: number; x1: number },
        canvasAPI: RenderEngine
    ) {
        if (executionState.isOnScroll) {
            totalScrolledY += event.movementY
            totalScrolledX += event.movementX

            state.offsetY = Math.round(totalScrolledY / state.grid) * state.grid
            state.offsetX = Math.round(totalScrolledX / state.grid) * state.grid

            state.needsUpdate = true
        } else {
            const S = nodesOnDrag.length
            if (IO.node !== undefined)
                RendererUtil.drawTempLink(event, parentElement, executionState.parentBBox, tempLink, canvasAPI)
            else if (S > 0) {
                for (let i = 0; i < S; i++)
                    nodesOnDrag[i].onMouseMove(event)
                canvasAPI.clear()
            }
        }
    }
}