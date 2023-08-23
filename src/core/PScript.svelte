<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import RenderEngine from "./instances/RenderEngine"
    import PScriptRendererState from "./libs/PScriptRendererState";
    import AbstractDraggable from "./instances/AbstractDraggable";

    export let scriptCanvas: RenderEngine
    export let allNodes: { label: string, getInstance: (x: number, y: number, canvas: RenderEngine) => typeof AbstractDraggable, class: string }[]

    let canvasElement
    onMount(() => scriptCanvas.initialize(canvasElement))
    onDestroy(() => {
        PScriptRendererState.destroyState(scriptCanvas.getId())
    })

    function onDrop(e: DragEvent) {
        const nodeId = e.dataTransfer.getData("text")
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const state = scriptCanvas.getState()
        const x = e.clientX - rect.left - state.offsetX;
        const y = e.clientY - rect.top - state.offsetY;
        const instance = allNodes.find(n => n.class === nodeId)?.getInstance?.(x, y, scriptCanvas)
        if(instance != null) {
            scriptCanvas.addNode(instance)
        }
    }
</script>

<div class="wrapper" on:drop={onDrop}>
    <canvas
            on:dragover={e => e.preventDefault()}
            class="canvas"
            bind:this={canvasElement}
    ></canvas>
</div>

<style>
    .canvas {
        color-rendering: optimizespeed;
        background: var(--pj-background-quaternary) radial-gradient(var(--pj-border-primary) 1px, transparent 0);
        background-size: 20px 20px;
    }

    .wrapper {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }
</style>
