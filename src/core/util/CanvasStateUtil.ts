import AbstractLink from "../instances/AbstractLink";
import CanvasStateStore from "../libs/CanvasStateStore";
import AbstractNode from "../instances/AbstractNode";
import CommentDraggable from "../instances/CommentDraggable";
import VariableGetterNode from "../instances/VariableGetterNode";
import VariableSetterNode from "../instances/VariableSetterNode";
import Variable from "../instances/Variable";

export default class CanvasStateUtil {
    static addLink(id: string, link: AbstractLink, noUpdate?: boolean) {
        const state = CanvasStateStore.getDataById(id)
        const foundExisting = state.links.findIndex(l => l.input === link.input)
        if (foundExisting > -1)
            state.links[foundExisting] = link
        else
            state.links.push(link)
        if (!noUpdate)
            state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }

    static removeLink(id: string, index: number) {
        const state = CanvasStateStore.getDataById(id)
        state.links.splice(index, 1)
        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }


    static addDraggable(id: string, node: IDraggable) {
        const state = CanvasStateStore.getDataById(id)
        if (node instanceof CommentDraggable) {
            state.comments.push(node)
        } else {
            state.nodes.push(<AbstractNode>node)
        }
        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }

    static removeDraggable(id: string, toRemove: INodeDraggable[]) {
        const state = CanvasStateStore.getDataById(id)
        const focusedFunction = CanvasStateStore.getData().focusedFunction
        for (let i = 0; i < toRemove.length; i++) {
            const draggable = toRemove[i];
            state.selected.delete(draggable.id)
            if (focusedFunction === draggable.id) {
                CanvasStateStore.updateProperty(id, "focusedFunction", undefined)
            }
            if (draggable instanceof AbstractNode) {
                const index = state.nodes.indexOf(draggable)
                if (index > -1) {
                    state.nodes.splice(index, 1)
                    const toRemove = state.links.filter(l => l.sourceNode === draggable || l.targetNode === draggable)
                    toRemove.forEach(l => {
                        CanvasStateUtil.removeLink(id, state.links.indexOf(l))
                    })
                }
            } else {
                const index = state.comments.indexOf(draggable)
                state.comments.splice(index, 1)
            }
        }
        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }

    static addVariable(id: string, type: IType, variableName: string): boolean {
        const state = CanvasStateStore.getDataById(id)
        const correctName = variableName.toLowerCase()
        if (state.variableNames[correctName])
            return false
        state.variableNames[correctName] = true
        state.variables.push(new Variable(correctName, type))
        CanvasStateStore.triggerDelayedUpdate(id)
        return true
    }

    static removeVariable(id: string, variableName: string) {
        const state = CanvasStateStore.getDataById(id)
        const variableIndex = state.variables.findIndex(v => v.getName() === variableName)

        if (variableIndex > -1) {
            const nodesWithVariable = state.nodes.filter(n => {
                return (n instanceof VariableGetterNode || n instanceof VariableSetterNode) && n.getVariable().getName() === variableName
            })
            this.removeDraggable(id, nodesWithVariable)
            const variablesRemoved = state.variables.splice(variableIndex, 1)

            delete state.variableNames[variablesRemoved[0].getName()]
            CanvasStateStore.triggerDelayedUpdate(id)
        }
    }

    static addVariableGetter(id: string, x: number, y: number, variableName: string) {
        const state = CanvasStateStore.getDataById(id)
        const name = variableName.toLowerCase()
        const variable = state.variables.find(v => v.getName() === name)
        if (variable != null) {
            const newNode = VariableGetterNode.of({
                variable,
                canvas: state.getInstance(),
                x,
                y,
                label: variableName + " (GETTER)",
                colorRGBA: [0, 255, 0, 1]
            })
            state.nodes.push(newNode)
            state.needsUpdate = true
            CanvasStateStore.triggerDelayedUpdate(id)
        }
    }

    static addVariableSetter(id: string, x: number, y: number, variableName: string) {
        const state = CanvasStateStore.getDataById(id)
        const name = variableName.toLowerCase()
        const variable = state.variables.find(v => v.getName() === name)
        if (variable != null) {
            const newNode = VariableSetterNode.of({
                variable,
                canvas: state.getInstance(),
                x,
                y,
                label: variableName + " (SETTER)",
                colorRGBA: [255, 0, 0, 1]
            })
            state.nodes.push(newNode)
            state.needsUpdate = true
            CanvasStateStore.triggerDelayedUpdate(id)
        }
    }

    static renameVariable(){
        // TODO
    }

    static changeVariableType(){
        // TODO
    }
}