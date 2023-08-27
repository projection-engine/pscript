import AbstractDraggable from "../instances/AbstractDraggable"
import AbstractNode from "../instances/AbstractNode"
import RendererUtil from "./RendererUtil";
import CommentDraggable from "../instances/CommentDraggable";
import CanvasRenderEngine from "../CanvasRenderEngine";
import PScriptUtil from "./PScriptUtil";
import FunctionDraggable from "../instances/FunctionDraggable";
import SelectionStore from "../libs/SelectionStore";

export default class IDraggableUtil {

    static getIOColor(attribute: IStateful, isSomeoneDisabled: boolean) {
        const r = attribute.colorRGBA[0],
            g = attribute.colorRGBA[1],
            b = attribute.colorRGBA[2]
        return `rgba(${r}, ${g}, ${b},${isSomeoneDisabled ? .5 : 1})`
    }

    static getIOPosition(index: number, node: INodeDraggable, asOutput: boolean): {
        x: number,
        y: number,
        height: number,
        width: number,
        rowY: number
    } {
        const coord = node.getTransformedCoordinates()

        const xN = coord.x, yN = coord.y, w = node.width
        const H = AbstractDraggable.HEADER_HEIGHT - 5
        const Y = yN + H * (index + 2)
        const xIO = !asOutput ? xN : xN + w
        const yIO = Y - AbstractNode.IO_RADIUS


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

    static onMouseDownEvent(BBox: DOMRect, IO: {
        node?: INodeDraggable;
        output?: IOutput
    }, nodesOnDrag, canvasAPI: CanvasRenderEngine, parentBBox, parentElement: HTMLElement, event: MouseEvent) {
        const state = canvasAPI.getState()
        const nodes = <AbstractNode[]>state.nodes
        const comments = <CommentDraggable[]>state.comments
        const links = state.links

        const X = (event.clientX - BBox.x) / state.scale
        const Y = (event.clientY - BBox.y) / state.scale

        if (!event.ctrlKey) {
            SelectionStore.updateStore({lastSelection: undefined})
            SelectionStore.getSelectionMap().clear()
        } else {
            SelectionStore.getSelectionMap().forEach(node => {
                nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
            })
        }

        let executionBroken = false

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i]
            const onBody = node.checkBodyClick(X, Y)
            const onHeader = node.checkHeaderClick(X, Y)
            if (!onHeader && !onBody)
                continue
            const isFunctionNode = node instanceof FunctionDraggable
            if(isFunctionNode){
                SelectionStore.updateStore({focusedFunction: node.id})
            }
            SelectionStore.getSelectionMap().set(node.id, node)
            SelectionStore.updateStore({lastSelection: node})
            if (onHeader) {
                if (isFunctionNode && node.checkAgainstCollapse(X, Y)) {
                    node.collapsed = !node.collapsed
                } else {
                    nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
                    node.isOnDrag = true
                }
            } else if (!event.ctrlKey) {
                const isOnScale = node.checkAgainstScale(X, Y)
                if (isOnScale) {
                    nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, false))
                    node.isOnDrag = true
                } else {
                    const output = node.checkAgainstIO<IOutput>(X, Y)
                    if (output != null) {
                        this.processOutputClick(IO, node, output);
                    } else {
                        const input = node.checkAgainstIO<IInput>(X, Y, true)
                        if (!input) {
                            executionBroken = true
                            break
                        }
                        const linkIndex = links.findIndex(l => l.input === input)
                        if (linkIndex === -1) {
                            executionBroken = true
                            break
                        }
                        this.processInputClick(links, linkIndex, IO, canvasAPI, event, parentElement, parentBBox);
                    }
                }
            }
            executionBroken = true
            break
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
        SelectionStore.updateStore({selected: SelectionStore.getSelectionMap()})
        if (nodesOnDrag.length > 0 || IO.node !== undefined)
            canvasAPI.__ctx.canvas.style.cursor = "grabbing"
        canvasAPI.clear()
    }

    private static processOutputClick(IO: {
        node?: INodeDraggable;
        output?: IOutput
    }, node: AbstractNode, output: IOutput) {
        IO.node = node
        IO.output = output
        const position = IDraggableUtil.getIOPosition(node.outputs.indexOf(output), node, true)
        const state = node.__canvas.getState()
        state.tempLinkCoords.startX = position.x
        state.tempLinkCoords.startY = position.y
        state.tempLinkCoords.color = `rgba(${output.colorRGBA})`
    }

    private static processInputClick(
        links: ILink[], linkIndex: number,
        IO: { node?: INodeDraggable; output?: IOutput },
        canvasAPI: CanvasRenderEngine, event: MouseEvent,
        parentElement: HTMLElement, parentBBox: DOMRect) {

        const found = links[linkIndex]
        const originalPosition = IDraggableUtil.getIOPosition((<AbstractNode>found.sourceNode).outputs.indexOf(found.output), <AbstractNode>found.sourceNode, true)
        IO.node = found.sourceNode
        IO.output = found.output

        canvasAPI.removeLink(linkIndex)
        const state = canvasAPI.getState()
        state.tempLinkCoords.startX = originalPosition.x
        state.tempLinkCoords.startY = originalPosition.y
        state.tempLinkCoords.color = `rgba(${found.input.colorRGBA})`
        RendererUtil.drawTempLink(event, parentElement, parentBBox, canvasAPI)
    }

    private static processCommentClick(onHeader: boolean, nodesOnDrag, event: MouseEvent, comment: CommentDraggable, parentBBox, X: number, Y: number, canvasAPI: CanvasRenderEngine) {
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

        SelectionStore.getSelectionMap().set(comment.id, comment)
        SelectionStore.updateStore({selected: SelectionStore.getSelectionMap(), lastSelection: comment})
    }

    static #checkOffset(ev1: MouseEvent, ev2: { x: number, y: number }): boolean {
        return Math.abs(ev1.clientX - ev2.x) < 10 && Math.abs(ev1.clientY - ev2.y) < 10
    }


    static getMousedownEvent(canvasAPI: CanvasRenderEngine): (this: HTMLCanvasElement, ev: WheelEvent) => void {

        const nodesOnDrag: { onMouseMove: Function, node: AbstractDraggable }[] = []
        const IO: { node: AbstractNode | undefined, output: IOutput | undefined } = {
            node: undefined,
            output: undefined
        }
        const parentElement = canvasAPI.__canvas.parentElement
        const executionState = {
            parentBBox: DOMRect = undefined,
            isOnScroll: false
        }
        return (mouseDownEvent: MouseEvent) => {
            if (mouseDownEvent.target !== canvasAPI.__canvas)
                return
            const {offsetX, offsetY} = canvasAPI.getState()
            const totalScrolled = {x: offsetX, y: offsetY}
            const handleMouseMove = (event: MouseEvent) => {
                IDraggableUtil.onMouseMove(executionState, totalScrolled, event, nodesOnDrag, IO, parentElement, canvasAPI);
            }
            const initialClick = {x: mouseDownEvent.clientX, y: mouseDownEvent.clientY}
            const BBox = canvasAPI.__canvas.getBoundingClientRect()
            executionState.parentBBox = parentElement.getBoundingClientRect()
            executionState.isOnScroll = mouseDownEvent.button === 2

            if (!executionState.isOnScroll)
                IDraggableUtil.onMouseDownEvent(BBox, IO, nodesOnDrag, canvasAPI, executionState.parentBBox, parentElement, mouseDownEvent)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", mouseUpEvent => {
                if (IO.node !== undefined) PScriptUtil.handleLink(canvasAPI, mouseUpEvent, BBox.x, BBox.y, IO.node, IO.output)

                if (executionState.isOnScroll && IDraggableUtil.#checkOffset(mouseUpEvent, initialClick))
                    IDraggableUtil.onMouseDownEvent(BBox, IO, nodesOnDrag, canvasAPI, executionState.parentBBox, parentElement, mouseUpEvent)
                IO.node = undefined
                IO.output = undefined
                const state = canvasAPI.getState()
                state.tempLinkCoords.x = state.tempLinkCoords.y = state.tempLinkCoords.startX = state.tempLinkCoords.startY = 0

                for (let i = 0; i < nodesOnDrag.length; i++) {
                    nodesOnDrag[i].node.isOnDrag = false
                }
                nodesOnDrag.length = 0
                document.removeEventListener("mousemove", handleMouseMove)
                canvasAPI.clear()
                canvasAPI.__canvas.style.cursor = "default"
            }, {once: true})
        }
    }

    private static onMouseMove(
        executionState: { isOnScroll: boolean, parentBBox: DOMRect },
        totalScrolled: { x: number, y: number },
        event: MouseEvent,
        nodesOnDrag: { onMouseMove: Function; node: AbstractDraggable }[],
        IO: { node?: INodeDraggable; output?: IOutput },
        parentElement: HTMLElement,
        canvasAPI: CanvasRenderEngine
    ) {
        const state = canvasAPI.getState()
        if (executionState.isOnScroll) {
            totalScrolled.y += event.movementY
            totalScrolled.x += event.movementX
            const G = state.grid / 2
            state.offsetY = Math.round(totalScrolled.y / G) * G
            state.offsetX = Math.round(totalScrolled.x / G) * G
            state.getInstance().__canvas.style.backgroundPosition = `${state.offsetX}px ${state.offsetY}px`
            state.needsUpdate = true
        } else {
            const S = nodesOnDrag.length
            if (IO.node !== undefined) {
                RendererUtil.drawTempLink(event, parentElement, executionState.parentBBox, canvasAPI)
            } else if (S > 0) {
                for (let i = 0; i < S; i++)
                    nodesOnDrag[i].onMouseMove(event)
                canvasAPI.clear()
            }
        }
    }
}
