<script lang="ts">
    import Icon from "../../components/icon/Icon.svelte";
    import CanvasStateUtil from "../util/CanvasStateUtil";
    import CanvasRenderEngine from "../CanvasRenderEngine";

    export let variables: IVariable[]
    export let scriptCanvas: CanvasRenderEngine
</script>

<button
        data-sveltebuttondefault="-"
        on:click={() => {
            CanvasStateUtil.addVariable(scriptCanvas.getId(), )
        }}
>
    <Icon>add</Icon>
    New variable
</button>
<div class="wrapper">
    {#each variables as variable}
        {variable.getName()}
    {/each}
</div>

<style>
    .wrapper {
        overflow-y: auto;
        width: 100%;
        height: 100%;
    }
</style>
