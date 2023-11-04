<script lang="ts">
    import Attribute from "./Attribute.svelte";
    import CommentDraggable from "../instances/CommentDraggable";
    import LocalizationEN from "../resources/LocalizationEN";
    import ColorPicker from "../../components/color-picker/ColorPicker.svelte";
    import Input from "../../components/input/Input.svelte";
    import Icon from "../../components/icon/Icon.svelte";

    export let node: IDraggable
    export let updateCanvas: Function


    function handleNodeChange(value: any, attr: MutableObject) {
        node[attr.key] = value
        // const input = (node as AbstractNode).inputs.find(i => i.key === attr.key)
        // input.onChange?.(value)
        updateCanvas()
    }
</script>

{#if !!node}
    <div class="content-wrapper">
        <div class="wrapper">
            <fieldset>
                <legend>{LocalizationEN.NAME}</legend>
                <Input
                        inputValue={node.name}
                        width={"100%"}
                        height="30px"
                        onChange={ev => {
                        node.name = ev
                        updateCanvas()
                    }}
                        placeholder={LocalizationEN.NAME}
                />
            </fieldset>
            {#if node instanceof CommentDraggable}
                <fieldset>
                    <legend>{LocalizationEN.COLOR}</legend>
                    <ColorPicker
                            submit={(_, arr) => {
                            node.color = arr
                            updateCanvas()
                        }}
                            value={node.color}
                    />
                </fieldset>
            {:else}
                {#each node.inputs as attr, i}

                    {#if attr.type}
                        {#key attr.key}
                            <fieldset>
                                <legend>{attr.label}</legend>
                                <Attribute
                                        attribute={attr}
                                        node={node}
                                        onChange={handleNodeChange}
                                        returnDefault={false}
                                />
                            </fieldset>
                        {/key}
                    {/if}

                {/each}
            {/if}
        </div>
    </div>
    {:else}
    <div data-svelteempty="-">
        <Icon styles="font-size: 50px">category</Icon>
        No node selected
    </div>
{/if}


<style>
    .content-wrapper {
        background: var(--pj-background-tertiary);
        overflow-y: auto;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        padding: 4px;
        max-height: 100%;
        overflow-x: hidden;
        width: 250px;
    }

    .wrapper {
        overflow-x: hidden;
        color: var(--pj-color-secondary);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: .75rem;
    }

    .wrapper > * {
        border-radius: 3px;
        padding: 4px;
        width: 100%;
        background: var(--pj-background-primary);
    }

</style>
