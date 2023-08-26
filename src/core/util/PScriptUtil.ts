import CommentDraggable from "../instances/CommentDraggable";
import RenderEngine from "../instances/RenderEngine";
import NodeDraggable from "../instances/NodeDraggable";
import RendererUtil from "./RendererUtil";
import {MaterialDataTypes} from "../pscript.enum";
import IDraggableUtil from "./IDraggableUtil";
import AbstractDraggable from "../instances/AbstractDraggable";

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
        const state = canvasAPI.getState()
        return e => {
            e.preventDefault()
            if (e.deltaY < 0 && localScale < 3)
                localScale += localScale * .1
            else if (e.deltaY > 0 && localScale >= .5)
                localScale -= localScale * .1

            state.scale = localScale
            canvasAPI.canvas.style.backgroundSize = `${20 * localScale}px ${20 * localScale}px`
            canvasAPI.clear()
        }
    }

    static handleLink(canvasAPI: RenderEngine, event: MouseEvent, x: number, y: number, sourceNode: NodeDraggable, sourceIO: IOutput) {
        // if (!sourceIO || !sourceNode)
        //     return
        // const N = canvasAPI.getState().nodes
        // const X = (event.clientX - x) / state.scale
        // const Y = (event.clientY - y) / state.scale
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
}
