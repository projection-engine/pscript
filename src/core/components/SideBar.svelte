<script lang="ts">

    import Nodes from "./Nodes.svelte";
    import AttributeEditor from "./AttributeEditor.svelte";
    import type RenderEngine from "../instances/RenderEngine";
    import type NodeDraggable from "../instances/NodeDraggable";
    import CommentDraggable from "../instances/CommentDraggable";
    import {onDestroy, onMount} from "svelte";
    import LocalizationEN from "../resources/LocalizationEN";
    import Icon from "../../components/icon/Icon.svelte";
    import ResizableBar from "../../components/resizable/ResizableBar.svelte";

    export let allNodes:{ label: string, class: string }[]
    export let scriptCanvas: RenderEngine

    let tab = 0
    let mainNode: NodeDraggable | CommentDraggable | undefined

    onMount(() => {
        scriptCanvas.lastSelectionListener = () => mainNode = scriptCanvas.lastSelection
    })

    onDestroy(() => {
        scriptCanvas.lastSelectionListener = undefined
    })

</script>

<div class="wrapper">
    <div style="max-width: 0"></div>
    <ResizableBar type="width"/>
    {#if tab === 0}
        <Nodes {allNodes}/>
    {:else if !!mainNode}
        <AttributeEditor node={mainNode} updateCanvas={() => scriptCanvas.clear()}/>
    {/if}
    <div class="buttons">
        <button data-sveltebuttondefault="-" class="button" data-sveltehighlight={tab === 0 ? "-" : ""}
                on:click={() => tab = 0}>
            <label>
                {LocalizationEN.ADD}
            </label>
            <Icon style="font-size: .9rem">add</Icon>
        </button>
        <button data-sveltebuttondefault="-" disabled={!mainNode} class="button"
                data-sveltehighlight={tab === 1 ? "-" : ""} on:click={() => tab = 1}>
            <label>
                {LocalizationEN.EDIT_NODE}
            </label>
            <Icon style="font-size: .9rem">edit</Icon>
        </button>
    </div>
</div>

<style>
    label {
        writing-mode: vertical-lr;
        rotate: 180deg;
    }

    .wrapper {
        background: var(--pj-background-tertiary);
        border-left: var(--pj-border-primary) 1px solid;

        width: fit-content;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        height: 100%;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-content: center;
        padding: 2px;
        gap: 4px;
        width: 25px;
        height: 100%;
    }

    .button {

        width: 20px;
        height: fit-content;
        font-size: .7rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 4px;

    }
</style>
