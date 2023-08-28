<script lang="ts">

    import Nodes from "./Nodes.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import type CanvasRenderEngine from "../CanvasRenderEngine";
    import {onDestroy, onMount} from "svelte";
    import LocalizationEN from "../resources/LocalizationEN";
    import Icon from "../../components/icon/Icon.svelte";
    import ResizableBar from "../../components/resizable/ResizableBar.svelte";
    import uuid from "uuidv4";
    import SelectionStore from "../libs/SelectionStore";

    export let allNodes: { label: string, class: string }[]
    export let scriptCanvas: CanvasRenderEngine

    let mainNode: IDraggable
    const COMPONENT_ID = uuid()

    onMount(() => {
        SelectionStore.getInstance().addListener(COMPONENT_ID, data => mainNode = data.lastSelection, ["lastSelection"])
    })

    onDestroy(() => {
        SelectionStore.getInstance().removeListener(COMPONENT_ID)
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
