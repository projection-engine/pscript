<script lang="ts">
    import CanvasRenderEngine from "../CanvasRenderEngine";
    import Variables from "./Variables.svelte";

    export let scriptCanvas: CanvasRenderEngine


</script>

<div class="wrapper-sidebar">
    <div class="items-sidebar">
        <div class="item-sidebar">
            <Variables scriptCanvas={scriptCanvas}/>
        </div>
    </div>
</div>

