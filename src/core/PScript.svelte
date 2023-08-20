<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import PScriptCanvas from "./libs/PScriptCanvas"
    import PScriptRendererState from "./libs/PScriptRendererState";

    export let scriptCanvas: PScriptCanvas

    let canvasElement
    onMount(() => scriptCanvas.initialize(canvasElement))
    onDestroy(() => {
        PScriptRendererState.destroyState(scriptCanvas.getId())
    })
</script>

<div class="wrapper">
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
