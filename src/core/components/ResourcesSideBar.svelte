<script lang="ts">

    import Nodes from "./Nodes.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import type CanvasRenderEngine from "../CanvasRenderEngine";
    import {onDestroy, onMount} from "svelte";
    import ResizableBar from "../../components/resizable/ResizableBar.svelte";
    import uuid from "uuidv4";
    import CanvasStateStore from "../libs/CanvasStateStore";

    export let allNodes: { label: string, class: string }[]
    export let scriptCanvas: CanvasRenderEngine

    let mainNode: IDraggable
    const COMPONENT_ID = uuid()

    onMount(() => {
        CanvasStateStore.getInstance().addListener(COMPONENT_ID, () => {
            mainNode = scriptCanvas.getState().lastSelection
        }, [scriptCanvas.getId()])
    })

    onDestroy(() => {
        CanvasStateStore.getInstance().removeListener(COMPONENT_ID)
    })

</script>

<div class="wrapper-sidebar">
    <div class="items-sidebar">
        <div class="item-sidebar">
            <Nodes {allNodes}/>
        </div>
        <ResizableBar type="height"/>
        <div class="item-sidebar">
            <AttributeEditor node={mainNode} updateCanvas={() => scriptCanvas.clear()}/>
        </div>
    </div>
</div>
