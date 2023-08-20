import AbstractStore from "./AbstractStore"
import {UUID} from "crypto";
import PScriptCanvas from "./PScriptCanvas";


export default class PScriptStore extends AbstractStore {
    updateStore(_) {}

    static createInstance(){
        const id = crypto.randomUUID()
        const instance = new PScriptCanvas(id)
        this.get<AbstractStore>().data[id] = instance
        return instance
    }

    static getCanvasInstance(instanceId: UUID): PScriptCanvas | undefined {
        return this.get<AbstractStore>().data[instanceId]
    }
}

