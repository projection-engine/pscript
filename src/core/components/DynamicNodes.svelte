<script lang="ts">
    import CanvasRenderEngine from "../CanvasRenderEngine";
    import Variables from "./Variables.svelte";
    import Functions from "./Functions.svelte";
    import uuid from "uuidv4";
    import CanvasStateStore from "../libs/CanvasStateStore";
    import {onDestroy, onMount} from "svelte";
    import AbstractFunctionNode from "../instances/AbstractFunctionNode";
    import PropertyType from "../instances/PropertyType";

    const COMPONENT_ID = uuid()
    export let scriptCanvas: CanvasRenderEngine
    export let types: PropertyType[]

    let functions: IFunctionNode[] = []
    let variables: IVariable[] = []

    onMount(() => {
        CanvasStateStore.getInstance().addListener(COMPONENT_ID, data => {
            console.trace("UPDATING")
            const state = data[scriptCanvas.getId()] as RendererState<CanvasRenderEngine>
            variables = state.variables
            functions = state.nodes.filter(n => n instanceof AbstractFunctionNode)
        }, [scriptCanvas.getId()])
    })
    onDestroy(() => CanvasStateStore.getInstance().removeListener(COMPONENT_ID))
</script>

<div class="wrapper-sidebar">
    <div class="items-sidebar">
        <div class="item-sidebar">
            <Variables
                    {types}
                    scriptCanvas={scriptCanvas}
                    variables={variables}
            />
        </div>
        <div class="item-sidebar">
            <Functions scriptCanvas={scriptCanvas} nodes={functions}/>
        </div>
    </div>
</div>

