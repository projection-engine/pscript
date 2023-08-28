<script lang="ts">
    import Icon from "../icon/Icon.svelte";

    export let tabs: { icon?: string, label: string, key: string, removable: boolean }[]
    export let selected: number
    export let setSelected: (index: number) => void
    export let removeTab: (index: number) => void

</script>

<div class="wrapper">
    {#each tabs as tab, index}
        <div class="item" class:highlight-item={selected === index}>
            <div class="label" role="button" on:click={() => setSelected(index)}>
                {#if tab.icon}
                    <Icon>{tab.icon}</Icon>
                {/if}
                {tab.label}
            </div>
            {#if tab.removable}
                <button data-sveltebuttondefault="-" class="btn" on:click={() => removeTab(index)}>
                    <Icon>close</Icon>
                </button>
            {/if}
        </div>
    {/each}
</div>

<style>
    .wrapper {
        display: flex;
        height: 30px;
        align-items: center;
        background: var(--pj-background-tertiary);
    }

    .highlight-item {
        background: var(--pj-background-primary) !important;
        border-bottom-color: white !important;

    }

    .item {
        height: 30px;
        width: fit-content;
        min-width: 100px;
        border-right: var(--pj-border-primary) 1px solid;
        background: var(--pj-background-tertiary);
        border-bottom: var(--pj-border-primary) 2px solid;
    }

    .label {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: .8rem;
        padding: 4px;
    }

    .btn {
        width: 20px;
        height: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
