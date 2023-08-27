import AbstractStore from "./AbstractStore"
import FunctionDraggable from "../instances/FunctionDraggable";

export default class SelectionStore extends AbstractStore{
    constructor() {
        super({
            selected: new Map<string, IDraggable>(),
            lastSelection: undefined,
            focusedFunction: undefined
        })
    }

    static getSelectionMap(): Map<string, IDraggable>{
        return this.getData().selected
    }

    static getLastSelection(): IDraggable{
        return this.getData().lastSelection
    }

    static getFocusedFunction(): string {
        return this.getData().focusedFunction
    }
}

