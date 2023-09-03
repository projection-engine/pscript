<script lang="ts">
    import CanvasRenderEngine from "../CanvasRenderEngine";
    import Variables from "./Variables.svelte";
    import Functions from "./Functions.svelte";
    import uuid from "uuidv4";
    import CanvasStateStore from "../libs/CanvasStateStore";
    import {onDestroy, onMount} from "svelte";
    import AbstractFunctionNode from "../instances/AbstractFunctionNode";
    import VariableGetterNode from "../instances/VariableGetterNode";

    const COMPONENT_ID = uuid()
    export let scriptCanvas: CanvasRenderEngine
    let variables: IVariableNode[] = []
    let functions: IFunctionNode[] = []

    onMount(() => {
        CanvasStateStore.getInstance().addListener(COMPONENT_ID, data => {
            const state = data[scriptCanvas.getId()] as RendererState<CanvasRenderEngine>
            const iFunctions: IFunctionNode[] = []
            const iVariables: IVariableNode[] = []
            state.nodes.forEach(node => {
                if (node instanceof AbstractFunctionNode) {
                    iFunctions.push(node)
                } else if (node instanceof VariableGetterNode) {
                    iVariables.push(node)
                }
            })
            variables = iVariables
            functions = iFunctions
        }, [scriptCanvas.getId()])
    })
    onDestroy(() => CanvasStateStore.getInstance().removeListener(COMPONENT_ID))
</script>

<div class="wrapper-sidebar">
    <div class="items-sidebar">
        <div class="item-sidebar">
            <Variables
                    scriptCanvas={scriptCanvas}
                    nodes={variables}
            />
        </div>
    </div>
    <div class="items-sidebar">
        <div class="item-sidebar">
            <Functions scriptCanvas={scriptCanvas} nodes={functions}/>
        </div>
    </div>
</div>

