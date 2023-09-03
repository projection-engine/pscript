import AbstractNode from "./AbstractNode";

export default abstract class AbstractFunctionNode extends AbstractNode implements IFunctionNode{
    _state: RendererState<null>
    getState(){
        return this._state
    }

    setState(newState: RendererState<any>){
        this._state = newState
    }
}
