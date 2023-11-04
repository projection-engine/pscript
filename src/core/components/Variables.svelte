<script lang="ts">
    import Icon from "../../components/icon/Icon.svelte";
    import CanvasStateUtil from "../util/CanvasStateUtil";
    import CanvasRenderEngine from "../CanvasRenderEngine";
    import PropertyType from "../instances/PropertyType";
    import ToolTip from "../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../components/dropdown/Dropdown.svelte";

    export let variables: IVariable[]
    export let scriptCanvas: CanvasRenderEngine
    export let types: PropertyType[]

    function createVar() {
        const state = scriptCanvas.getState()
        console.trace("HERE", state)
        const initialName = "new variable"
        const quantityWithName = state.variables.filter(v => v.getName().includes(initialName)).length
        CanvasStateUtil.addVariable(scriptCanvas.getId(), types[0], quantityWithName > 0 ? `${initialName} (${quantityWithName})` : initialName)
    }

    function onChange(variable: IVariable) {
        let timeout
        return (event: InputEvent) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const element = (event.target as HTMLInputElement)
                CanvasStateUtil.renameVariable(scriptCanvas.getId(), variable, element.value)
            }, 50)
        }
    }
</script>

<div class="wrapper">
    <button
            data-sveltebuttondefault="-"
            on:click={createVar}
            class="btn"
    >
        <Icon>add</Icon>
        New variable
    </button>
    <div class="content">
        {#each variables as variable}
            <div class="var">
                <Dropdown hideArrow noBackground>
                    <div slot="button" class="type-color"
                         style={`background: rgba(${variable.getType().getColor()})`}></div>
                    {#each types as type}
                        <button
                                data-sveltehighlight={type.getName() === variable.getType().getName() ? "-" : undefined}
                                data-sveltebuttondefault="-"
                                class="var"
                                on:click={() => CanvasStateUtil.changeVariableType(scriptCanvas.getId(), variable, type)}
                        >
                            <div class="type-color" style={`background: rgba(${type.getColor()})`}></div>
                            {type.getName()}
                        </button>
                    {/each}
                </Dropdown>
                <ToolTip content={variable.getType().getName()}/>
                <input value={variable.getName()} on:change={onChange(variable)}/>
                <div
                        class="getter"
                        draggable="true"
                        on:dragstart={e => e.dataTransfer.setData("text", JSON.stringify({type: "var-getter", content: variable.getName()}))}
                >
                    <Icon>drag_indicator</Icon>
                    <ToolTip content="Getter"/>
                </div>
                <div
                        class="setter"
                        draggable="true"
                        on:dragstart={e => e.dataTransfer.setData("text", JSON.stringify({type: "var-setter", content: variable.getName()}))}
                >
                    <Icon>drag_indicator</Icon>
                    <ToolTip content="Setter"/>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .setter, .getter {
        min-width: 20px;
        min-height: 20px;

        max-width: 20px;
        max-height: 20px;

        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
    }

    .setter {
        background: rgba(255, 0, 0, 100);

    }

    .getter {
        background: rgba(0, 128, 0, 100);
    }

    .btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 4px;
    }

    .content {
        overflow-y: auto;
        width: 100%;
        height: 100%;
    }


    .var {
        width: 100%;
        height: 25px;
        padding: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: .9rem;
        border: 3px;
    }

    .var:nth-child(even) {
        background: var(--pj-background-secondary) !important;
    }


    .var > input {
        background: none;
        border: none;
        color: var(--pj-color-primary);
        width: auto;
    }

    .type-color {
        width: 20px;
        height: 7px;
        border-radius: 7px;
    }

</style>
