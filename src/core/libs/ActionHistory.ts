import type CanvasRenderEngine from "../CanvasRenderEngine"
import AbstractNode from "../instances/AbstractNode"
import Comment from "../instances/Comment"
import ToastNotificationSystem from "../../components/alert/ToastNotificationSystem";
import LocalizationEN from "../resources/LocalizationEN";
import UndoRedo from "./UndoRedo";


export default class ActionHistory {
    #cache = new UndoRedo<IAction>()
    canvas: CanvasRenderEngine

    clear() {
        this.#cache.index = 0
        this.#cache.history = [null]
    }

    save(value: (AbstractNode | Comment)[], isRemoval?: boolean) {
        // if (value.length === 0)
        //     return
        // const data = value.map(v => {
            // if (v instanceof AbstractNode)
            //     return ShaderEditorTools.serializeNode(v)
            // return ShaderEditorTools.serializeComment(v)
        // })
        //
        // this.#cache.save({
        //     toRemove: data.map(d => d.id),
        //     toAdd: !isRemoval ? data : undefined
        // })
    }

    undo() {
        const action = this.#cache.undo()
        if (action) {
            ToastNotificationSystem.getInstance().log(LocalizationEN.UNDOING_CHANGES)
            this.#apply(action)
        }
    }

    redo() {
        const action = this.#cache.redo()
        if (action) {
            ToastNotificationSystem.getInstance().log(LocalizationEN.REDOING_CHANGES)
            this.#apply(action)
        }
    }

    #apply(action: IAction) {
        const {toAdd, toRemove} = action
        this.canvas.removeDraggable(toRemove, true)
        if (toAdd)
            for (let i = 0; i < toAdd.length; i++) {
                const current = toAdd[i]
                if (current.DATA_TYPE === "comment") {
                    // const parsed = new Comment(current.x, current.y)
                    // parsed.color = current.color
                    // parsed.name = current.name
                    // parsed.width = current.width
                    // parsed.height = current.height
                    // this.canvas.addComment(parsed, true)
                } else {
                    // const parsed = ShaderEditorTools.parseNode(current)
                    // if (!parsed)
                    // 	continue
                    // this.canvas.addNode(parsed, true)
                }
            }
        this.canvas.clear()
    }
}
