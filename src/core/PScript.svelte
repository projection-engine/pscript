<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import CanvasRenderEngine from "./CanvasRenderEngine"
    import AbstractDraggable from "./instances/AbstractDraggable";
    import ActionBar from "./components/ActionBar.svelte";
    import SideBar from "./components/ResourcesSideBar.svelte";
    import Tabs from "../components/tabs/Tabs.svelte";
    import ResizableBar from "../components/resizable/ResizableBar.svelte";
    import CanvasStateStore from "./libs/CanvasStateStore";
    import CanvasStateUtil from "./util/CanvasStateUtil";

    export let scriptCanvas: CanvasRenderEngine
    export let allNodes: {
        label: string,
        getInstance: (x: number, y: number, canvas: CanvasRenderEngine) => typeof AbstractDraggable,
        class: string
    }[]

    let tabs = [
        {
            label: "Editor",
            removable: false,
            key: "EDITOR"
        }
    ]
    let selectedTab = 0
    let canvasElement

    onMount(() => scriptCanvas.initialize(canvasElement))
    onDestroy(() => CanvasStateStore.destroyState(scriptCanvas.getId()))

    function onDrop(e: DragEvent) {
        const data = e.dataTransfer.getData("text")
        try {
            const target = e.currentTarget as HTMLElement;
            const rect = target.getBoundingClientRect();
            const state = scriptCanvas.getState()
            const x = e.clientX - rect.left - state.offsetX;
            const y = e.clientY - rect.top - state.offsetY;

            const payload = JSON.parse(data)
            switch (payload.type) {
                case "node": {
                    const instance = allNodes.find(n => n.class === payload.content)?.getInstance?.(x, y, scriptCanvas)
                    if (instance != null) {
                        CanvasStateUtil.addDraggable(scriptCanvas.getId(), instance)
                    }
                    break
                }
                case "var-getter":
                    CanvasStateUtil.addVariableGetter(scriptCanvas.getId(), x, y, payload.content)
                    break
                case "var-setter":
                    CanvasStateUtil.addVariableSetter(scriptCanvas.getId(), x, y, payload.content)
                    break
            }

        } catch (ex) {
            console.error(ex)
        }
    }
</script>

<ActionBar canvas={scriptCanvas}/>
<Tabs
        tabs={tabs}
        setSelected={v => selectedTab = v}
        selected={selectedTab}
        removeTab={index => {
            tabs.slice(index, 1)
            tabs = tabs
        }}
/>
<div class="content">
    <slot name="dynamic-nodes"/>
    <ResizableBar type="width"/>
    <div class="wrapper" on:drop={onDrop}>
        <canvas
                on:dragover={e => e.preventDefault()}
                class="canvas"
                bind:this={canvasElement}
        ></canvas>
    </div>
    <ResizableBar type="width"/>
    <SideBar
            allNodes={allNodes}
            scriptCanvas={scriptCanvas}
    />
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

    .content {
        border-top: var(--pj-border-primary) 1px solid;

        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }


    :global(.wrapper-sidebar) {
        background: var(--pj-background-tertiary);
        min-width: 250px;
        width: fit-content;
        display: flex;
        height: 100%;
    }

    :global(.items-sidebar) {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    :global(.item-sidebar) {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

</style>
