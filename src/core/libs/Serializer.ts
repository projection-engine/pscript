import AbstractStateful from "../instances/AbstractStateful";
import Comment from "../instances/Comment"
import PropertyType from "../instances/PropertyType";
import NodeType from "../instances/NodeType";
import Output from "../instances/Output";
import Input from "../instances/Input";
import ExecutionLink from "../instances/ExecutionLink";
import ExecutionOutput from "../instances/ExecutionOutput";
import ExecutionInput from "../instances/ExecutionInput";
import Bend from "../instances/Bend";
import AbstractSerializable from "../instances/AbstractSerializable";
import CanvasRenderEngine from "../CanvasRenderEngine";
import AbstractNode from "../instances/AbstractNode";
import AbstractDraggable from "../instances/AbstractDraggable";

export default class Serializer {
    static #types: typeof AbstractSerializable<any>[] = [
        Comment,
        ExecutionInput,
        ExecutionOutput,
        ExecutionLink,
        Input,
        Output,
        NodeType,
        PropertyType,
    ]

    static addTypes(...types: typeof AbstractSerializable<any>[]) {
        Serializer.#types.push(...types)
    }

    static serialize(data: RendererState<CanvasRenderEngine>): string {
        const copy: MutableObject = {...data}
        copy.nodes = data.nodes.map(this.#serializeISerializable)
        copy.links = data.links.map(this.#serializeISerializable)
        copy.comments = data.comments.map(this.#serializeISerializable)
        copy.functions = data.functions.map(this.#serializeISerializable)
        return JSON.stringify(copy)
    }

    static #serializeISerializable(data: ISerializable<any>): MutableObject {
        const visited = new WeakSet();
        (data as MutableObject).classPath = Serializer.#types.findIndex(e => e.name == data.constructor.name);

        return JSON.parse(JSON.stringify(
            data,
            (key, value) => {
                if (key.startsWith("#") || key.startsWith("__"))
                    return undefined

                if (typeof value === "object" && value !== null) {
                    if (visited.has(value))
                        return
                    visited.add(value)
                }
                if (value != null && Array.isArray(value)) {
                    value = value.map(v => {
                        if (value instanceof AbstractSerializable)
                            return Serializer.#serializeISerializable(value)
                        return v
                    })
                }
                if (value instanceof AbstractSerializable && value != data) {
                    return Serializer.#serializeISerializable(value)
                }
                return value
            }))
    }

    static deserialize(canvas: CanvasRenderEngine, state: string): RendererState<CanvasRenderEngine> {
        const json = JSON.parse(state)
        json.nodes = json.nodes.map(d => Serializer.#deserializeISerializable(canvas, d))
        json.links = json.links.map(d => Serializer.#deserializeISerializable(canvas, d))
        json.comments = json.comments.map(d => Serializer.#deserializeISerializable(canvas, d))
        json.functions = json.functions.map(d => Serializer.#deserializeISerializable(canvas, d))
        json.getInstance = () => canvas
        return json
    }

    static #deserializeISerializable(canvas: CanvasRenderEngine, data: string | Object): ISerializable<any> {
        const obj = typeof data === "string" ? JSON.parse(data) : data
        const instance = new Serializer.#types[obj.classPath]();
        Object.entries(obj).forEach(([key, value]) => {
            if (key === "classPath")
                return
            if (typeof value === "object")
                console.log(value)

            if (Serializer.checkIfIsDeserializable(value)) {
                instance[key] = Serializer.#deserializeISerializable(canvas, value)
            } else if (Array.isArray(value)) {
                instance[key] = value.map(el => {
                    if (Serializer.checkIfIsDeserializable(el)) {
                        return Serializer.#deserializeISerializable(canvas, el)
                    }
                    return el
                })
            } else {
                instance[key] = value
            }
        })
        if (instance instanceof AbstractDraggable) {
            instance.__canvas = canvas
        }
        return instance
    }

    private static checkIfIsDeserializable(value) {
        return typeof value === "object" && !Array.isArray(value) && Object.hasOwn(value, "classPath") && value.classPath > -1;
    }
}
