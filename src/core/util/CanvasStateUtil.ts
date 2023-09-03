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


    static removeLinks(id: string, links: ILink[]) {
        const state = CanvasStateStore.getDataById(id)
        state.links = state.links.filter(l => !links.includes(l))
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
        const toRemoveMap = {}
        for (let i = 0; i < toRemove.length; i++) {
            const draggable = toRemove[i];
            state.selected.delete(draggable.id)
            toRemoveMap[draggable.id] = draggable
            if (focusedFunction === draggable.id) {
                CanvasStateStore.updateProperty(id, "focusedFunction", undefined)
            }
            if (draggable instanceof AbstractNode) {
                const index = state.nodes.indexOf(draggable)
                if (index > -1) {
                    state.nodes.splice(index, 1)
                }
            } else {
                const index = state.comments.indexOf(draggable)
                state.comments.splice(index, 1)
            }
        }

        const linksToRemove = state.links.flatMap((l, index) => {
            return (toRemoveMap[l.sourceNode.id] != null || toRemoveMap[l.targetNode.id] != null) ? [l] : []
        })
        CanvasStateUtil.removeLinks(id, linksToRemove)

        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }

    static addVariable(id: string, type: IType, variableName: string): boolean {
        const state = CanvasStateStore.getDataById(id)
        console.trace(state.variableNames, variableName)
        if (state.variableNames[variableName])
            return false
        state.variableNames[variableName] = true
        state.variables.push(new Variable(variableName, type))
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
        const variable = state.variables.find(v => v.getName() === variableName)
        if (variable != null) {
            const newNode = VariableGetterNode.of({
                variable,
                canvas: state.getInstance(),
                x,
                y,
                label: variableName + " (GETTER)",
                colorRGBA: variable.getType().getColor()
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
                colorRGBA: variable.getType().getColor()
            })
            state.nodes.push(newNode)
            state.needsUpdate = true
            CanvasStateStore.triggerDelayedUpdate(id)
        }
    }

    static renameVariable(id: string, variable: IVariable, value: string) {
        const state = CanvasStateStore.getDataById(id)
        delete state.variableNames[variable._name]
        variable._name = value
        state.variableNames[value] = true
        state.nodes.forEach(n => {
            if (n instanceof VariableGetterNode && n.getVariable() === variable) {
                n.label = value + " (GETTER)"
            } else if (n instanceof VariableSetterNode && n.getVariable() === variable) {
                n.label = value + " (SETTER)"
            }
        })
        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }

    static changeVariableType(id: string, variable: IVariable, value: IType) {
        const state = CanvasStateStore.getDataById(id)
        variable._type = value
        let nodesToRecreate: IVariableNode[] = <IVariableNode[]>state.nodes.filter(n => {
            return (n instanceof VariableGetterNode || n instanceof VariableSetterNode) && n.getVariable() === variable
        })
        CanvasStateUtil.removeDraggable(id, nodesToRecreate)
        nodesToRecreate = nodesToRecreate.map(n => {
            const variableProps = {
                variable: n._variable,
                canvas: state.getInstance(),
                x: n.x,
                y: n.y,
                label: n.label,
                colorRGBA: variable.getType().getColor()
            }
            if (n instanceof VariableGetterNode)
                return VariableGetterNode.of(variableProps)
            else if (n instanceof VariableSetterNode)
                return VariableSetterNode.of(variableProps)
        })
        state.nodes.push(...nodesToRecreate)
        state.needsUpdate = true
        CanvasStateStore.triggerDelayedUpdate(id)
    }
}
