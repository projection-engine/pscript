import CommentDraggable from "../instances/CommentDraggable";
import RenderEngine from "../instances/RenderEngine";
import NodeDraggable from "../instances/NodeDraggable";
import CanvasResources from "../libs/CanvasResources";
import RendererUtil from "./RendererUtil";
import Link from "../instances/Link";
import {MaterialDataTypes} from "../pscript.enum";
import IDraggableUtil from "./IDraggableUtil";
import AbstractDraggable from "../instances/AbstractDraggable";
import ToastNotificationSystem from "../../components/alert/ToastNotificationSystem";
import LocalizationEN from "../resources/LocalizationEN";
import PScriptRendererState from "../libs/PScriptRendererState";

export default class PScriptUtil {
    static addComment(canvasAPI: RenderEngine) {
        let smallestX: number | undefined,
            smallestY: number | undefined,
            biggestX: number | undefined,
            biggestY: number | undefined


        canvasAPI.selectionMap
            .forEach(n => {
                if (n instanceof CommentDraggable)
                    return
                if (!smallestX || n.x < smallestX)
                    smallestX = n.x
                if (!smallestY || n.y < smallestY)
                    smallestY = n.y

                if (!biggestX || n.x + n.width > biggestX)
                    biggestX = n.x + n.width
                if (!biggestY || n.y + n.height > biggestY)
                    biggestY = n.y + n.height
            })

        smallestX -= 4
        smallestY -= 36

        const comment = new CommentDraggable(canvasAPI, Math.max(smallestX, 0), Math.max(smallestY, 0), "New Comment", [155, 155, 155, 1])
        comment.width = 8 + (biggestX - smallestX)
        comment.height = 40 + (biggestY - smallestY)
        canvasAPI.addNode(comment)
    }


    static getCanvasZoomEvent(canvasAPI: RenderEngine): (this: HTMLCanvasElement, ev: WheelEvent) => void {
        let localScale = 1
        return e => {
            e.preventDefault()
            if (e.deltaY < 0 && localScale < 3)
                localScale += localScale * .1
            else if (e.deltaY > 0 && localScale >= .5)
                localScale -= localScale * .1

            CanvasResources.scale = localScale
            canvasAPI.canvas.style.backgroundSize = `${20 * localScale}px ${20 * localScale}px`
            canvasAPI.clear()
        }
    }

    static handleLink(canvasAPI: RenderEngine, event: MouseEvent, x: number, y: number, sourceNode: NodeDraggable, sourceIO: IOutput) {
        // if (!sourceIO || !sourceNode)
        //     return
        // const N = canvasAPI.getState().nodes
        // const X = (event.clientX - x) / CanvasResources.scale
        // const Y = (event.clientY - y) / CanvasResources.scale
        //
        // for (let i = N.length - 1; i >= 0; i--) {
        //     const node = N[i]
        //     if (node instanceof NodeDraggable) {
        //         const onBody = node.checkBodyClick(X, Y)
        //         if (onBody) {
        //             const targetIO = node.checkAgainstIO<IInput>(X, Y, true)
        //
        //             if (targetIO && targetIO.accept.includes(sourceIO.type)) {
        //                 const newLink = new Link(node, sourceNode, targetIO, sourceIO)
        //                 canvasAPI.addLink(newLink)
        //             } else if (targetIO) {
        //                 ToastNotificationSystem.getInstance().error(LocalizationEN.INVALID_TYPE)
        //             }
        //             break
        //         }
        //     }
        // }
    }

    static getMousedownEvent(canvasAPI: RenderEngine): (this: HTMLCanvasElement, ev: WheelEvent) => void {
        const nodesOnDrag: { onMouseMove: Function, node: AbstractDraggable }[] = []
        const IO: { node: NodeDraggable | undefined, output: IOutput | undefined } = {node: undefined, output: undefined}
        const parentElement = canvasAPI.canvas.parentElement
        const tempLink = {x: 0, y: 0, x1: 0, y1: 0}
        let isOnScroll = false
        let parentBBox: MutableObject
        const initialClick = {x: 0, y: 0}
        const STATE = canvasAPI.getState()
        let totalScrolledX = STATE.offsetX
        let totalScrolledY = STATE.offsetY
        const handleMouseMove = (event) => {
            if (isOnScroll) {
                totalScrolledY += event.movementY
                totalScrolledX += event.movementX

                STATE.offsetY = Math.round(totalScrolledY / CanvasResources.grid) * CanvasResources.grid
                STATE.offsetX = Math.round(totalScrolledX / CanvasResources.grid) * CanvasResources.grid

                STATE.needsUpdate = true
            } else {
                const S = nodesOnDrag.length
                if (IO.node !== undefined)
                    RendererUtil.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
                else if (S > 0) {
                    for (let i = 0; i < S; i++)
                        nodesOnDrag[i].onMouseMove(event)
                    canvasAPI.clear()
                }
            }
        }

        return (mouseDownEvent: MouseEvent) => {
            if (mouseDownEvent.target !== canvasAPI.canvas)
                return
            initialClick.x = mouseDownEvent.clientX
            initialClick.y = mouseDownEvent.clientY
            const BBox = canvasAPI.canvas.getBoundingClientRect()
            parentBBox = parentElement.getBoundingClientRect()
            isOnScroll = mouseDownEvent.button === 2

            if (!isOnScroll)
                PScriptUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseDownEvent)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", mouseUpEvent => {
                if (IO.node !== undefined) PScriptUtil.handleLink(canvasAPI, mouseUpEvent, BBox.x, BBox.y, IO.node, IO.output)

                if (isOnScroll && PScriptUtil.#checkOffset(mouseUpEvent, initialClick))
                    PScriptUtil.onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI, parentBBox, parentElement, mouseUpEvent)
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
    }

    static #checkOffset(ev1: MouseEvent, ev2: { x: number, y: number }): boolean {
        return Math.abs(ev1.clientX - ev2.x) < 10 && Math.abs(ev1.clientY - ev2.y) < 10
    }

    static getNewVector(value, v, index, type) {
        switch (type) {
            case  MaterialDataTypes.VEC2:
                return [index === 0 ? v : value[0], index === 1 ? v : value[1]]
            case  MaterialDataTypes.VEC3:
                return [
                    index === 0 ? v : value[0],
                    index === 1 ? v : value[1],
                    index === 2 ? v : value[2]
                ]
            case  MaterialDataTypes.VEC4:
                return [
                    index === 0 ? v : value[0],
                    index === 1 ? v : value[1],
                    index === 2 ? v : value[2],
                    index === 3 ? v : value[3]
                ]
            default:
                return value
        }
    }

    static onMouseDownEvent(BBox, IO, tempLink, nodesOnDrag, canvasAPI: RenderEngine, parentBBox, parentElement: HTMLElement, event: MouseEvent) {
        const state = canvasAPI.getState()
        const nodes =  <AbstractDraggable[]>state.nodes
        const links = state.links

        const X = (event.clientX - BBox.x) / CanvasResources.scale
        const Y = (event.clientY - BBox.y) / CanvasResources.scale

        if (!event.ctrlKey) {
            canvasAPI.lastSelection = undefined
            canvasAPI.selectionMap.clear()
        } else
            canvasAPI.selectionMap.forEach(node => {
                nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
            })

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i]
            if (node instanceof NodeDraggable) {
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
                            if (output) {
                                IO.node = node
                                IO.output = output
                                const position = IDraggableUtil.getIOPosition(node.outputs.indexOf(output), node, true)
                                tempLink.x = position.x
                                tempLink.y = position.y
                            } else {
                                const input = node.checkAgainstIO<IInput>(X, Y, true)
                                if (!input)
                                    break
                                const F = links.findIndex(l => l.input === input)
                                if (F === -1)
                                    break
                                const found = links[F]
                                const originalPosition = IDraggableUtil.getIOPosition((<NodeDraggable>found.sourceNode).outputs.indexOf(found.output), <NodeDraggable>found.sourceNode, true)
                                IO.node = found.sourceNode
                                IO.output = found.output

                                canvasAPI.removeLink(F)

                                tempLink.x = originalPosition.x
                                tempLink.y = originalPosition.y
                                RendererUtil.drawTempLink(event, parentElement, parentBBox, tempLink, canvasAPI)
                            }
                        }
                    }
                    break
                }
            } else {
                const onBody = node.checkBodyClick(X, Y)
                const onHeader = node.checkHeaderClick(X, Y)
                if (onHeader || onBody) {
                    if (onHeader) {
                        nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, true))
                        node.isOnDrag = true
                    } else if (!event.ctrlKey) {
                        const isOnScale = node.checkAgainstScale(X, Y)
                        if (isOnScale) {
                            nodesOnDrag.push(IDraggableUtil.drag(event, node, parentBBox, false))
                            node.isOnDrag = true
                        }
                    }
                    canvasAPI.selectionMap.set(node.id, node)
                    canvasAPI.lastSelection = node
                    break
                }
            }
        }

        if (nodesOnDrag.length > 0 || IO.node !== undefined)
            canvasAPI.ctx.canvas.style.cursor = "grabbing"
        canvasAPI.clear()
    }
}
