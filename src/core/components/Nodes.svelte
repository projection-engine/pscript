<script lang="ts">
    import LocalizationEN from "../resources/LocalizationEN";
    import Input from "../../components/input/Input.svelte";
    import Icon from "../../components/icon/Icon.svelte";

    export let allNodes: { label: string, class: string }[] = []
    let inputValue = ""
    let nodes
    let interval

    $: nodes = !inputValue ? allNodes : allNodes.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))

    function onChange(e: InputEvent) {
        clearInterval(interval)
        const value = (e.target as HTMLInputElement).value
        interval = setInterval(() => inputValue = value)
    }
</script>

<div class="search-input">
    <Icon slot="icon">search</Icon>
    <input
            on:change={onChange}
            value={inputValue}
            placeholder={LocalizationEN.SEARCH}
    />
</div>
<div class="content">
    {#each nodes as d, i}
        <div
                class="node"
                draggable="true"
                on:dragstart={e => e.dataTransfer.setData("text", d.class)}
        >
            <Icon>drag_indicator</Icon>
            {d.label}
        </div>
    {/each}
</div>


<style>
    .search-input {
        display: flex;
        align-items: center;
        height: 30px;
        overflow: hidden;
        padding: 4px;
        gap: 4px;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .search-input > input {
        border: none;
        background: none;
        outline: none;
        color: var(--pj-color-primary);
    }

    .content {
        padding: 3px;
        display: flex;
        flex-flow: wrap;
        gap: 2px;
        max-height: 100%;
        overflow-y: auto;
    }

    .node {
        transition: 150ms linear;
        display: flex;
        align-items: center;
        width: fit-content;
        height: 25px;
        gap: 4px;
        padding: 4px 4px 4px 0px;
        border-radius: 3px;
        cursor: grab;
        background: var(--pj-background-primary);
        font-size: .8rem;
    }

    .node:hover{
        color: var(--pj-accent-color);
    }
    .node:active{
        cursor: grab;
        background: var(--pj-accent-color) !important;
        color: white;
    }
</style>
