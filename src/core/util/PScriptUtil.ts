import CanvasRenderEngine from "../CanvasRenderEngine";
import AbstractNode from "../instances/AbstractNode";
import {MaterialDataTypes} from "../pscript.enum";
import LocalizationEN from "../resources/LocalizationEN";
import ToastNotificationSystem from "../../components/alert/ToastNotificationSystem";
import AbstractLink from "../instances/AbstractLink";
import Link from "../instances/Link";

export default class PScriptUtil {
    /**
     * Returns dimensions that wrap selected draggables
     * @param canvasAPI
     */
    static getWrappingRect(canvasAPI: CanvasRenderEngine): { width: number, height: number } {
        let smallestX: number | undefined,
            smallestY: number | undefined,
            biggestX: number | undefined,
            biggestY: number | undefined

        canvasAPI.selectionMap
            .forEach(n => {
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

        return {
            width: 8 + (biggestX - smallestX),
            height: 40 + (biggestY - smallestY)
        }
    }


    static getCanvasZoomEvent(canvasAPI: CanvasRenderEngine): (this: HTMLCanvasElement, ev: WheelEvent) => void {
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

    static handleLink(canvasAPI: CanvasRenderEngine, event: MouseEvent, x: number, y: number, sourceNode: INodeDraggable, sourceIO: IOutput) {
        if (!sourceIO || !sourceNode)
            return
        const state = canvasAPI.getState()
        const N = state.nodes
        const X = (event.clientX - x) / state.scale
        const Y = (event.clientY - y) / state.scale

        for (let i = N.length - 1; i >= 0; i--) {
            const node = N[i]
            if (node instanceof AbstractNode) {
                const onBody = node.checkBodyClick(X, Y)
                if (onBody) {
                    const targetIO = node.checkAgainstIO<IInput>(X, Y, true)
                    if (targetIO?.acceptsType?.(sourceIO.type)) {
                        const newLink = new Link(node, sourceNode, targetIO, sourceIO)
                        canvasAPI.addLink(newLink)
                    } else if (targetIO) {
                        ToastNotificationSystem.getInstance().error(LocalizationEN.INVALID_TYPE)
                    }
                    break
                }
            }
        }
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
