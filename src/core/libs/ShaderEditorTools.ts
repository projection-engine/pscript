import PScriptCanvas from "./PScriptCanvas"
import type PNode from "./PNode"
import PComment from "./PComment"

export default class ShaderEditorTools {
    static GRID_SIZE = 20
    static scale = 1
    static grid = ShaderEditorTools.GRID_SIZE
    static copied = new Map()

    static parseNode(node) {
        // if (!node)
        //     return
        // const nodeInstance = NodesIndex[node.instance] ? new NodesIndex[node.instance]() : undefined
        // if (!nodeInstance) {
        //     return
        // }
        // Object.keys(node).forEach(o => {
        //     const input = nodeInstance.inputs.find(i => i.key === o)
        //     if (!input && !nodeInstance.output.find(i => i.key === o))
        //         return
        //     if (input && input.onChange) {
        //         nodeInstance[o] = node[o]
        //         input.onChange(node[o])
        //     } else
        //         nodeInstance[o] = node[o]
        // })
        //
        // nodeInstance.x = node.x
        // nodeInstance.name = node.name
        // nodeInstance.id = node.id
        // nodeInstance.y = node.y
        // nodeInstance.width = Math.max(node.width, nodeInstance.minWidth)
        // nodeInstance.height = Math.max(node.height, nodeInstance.minHeight)
        // return nodeInstance
    }

    static copy(nodes) {
        ShaderEditorTools.copied.clear()
        for (let i = 0; i < nodes.length; i++)
            if (nodes[i])
                ShaderEditorTools.copied.set(nodes[i].id, ShaderEditorTools.serializeNode(nodes[i]))
    }

    static paste(canvasAPI: PScriptCanvas) {
        // ShaderEditorTools.copied.forEach(d => {
        //     canvasAPI.addNode(ShaderEditorTools.parseNode({...d, id: crypto.randomUUID()}), true, true)
        // })
        // canvasAPI.clear()
    }

    static serializeNode(n: PNode) {
        return {
            ...n,
            instance: n.getSignature(),
            // texture: n.texture && typeof n.texture === "object" ? {registryID: n.texture.registryID} : undefined,
            DATA_TYPE: "node"
        }
    }

    static serializeComment(c: PComment) {
        return {...c, DATA_TYPE: "comment"}
    }
}
