<script lang="ts">
    import {MaterialDataTypes} from "../pscript.enum";
    import ShaderEditorUtil from "../util/PScriptUtil";
    import Range from "../../components/range/Range.svelte";
    import ColorPicker from "../../components/color-picker/ColorPicker.svelte";
    import Dropdown from "../../components/dropdown/Dropdown.svelte";
    import Icon from "../../components/icon/Icon.svelte";
    import Checkbox from "../../components/checkbox/Checkbox.svelte";

    export let attribute
    export let node
    export let onChange
    export let returnDefault

    let value = node[attribute.key]
    function handleChange(newValue){
    	value = newValue
    	onChange(newValue, attribute)
    }


    const label = attribute.label, type = attribute.type
    $: possibleSelection= attribute.options ? attribute.options.find(v => v.data === value) : undefined

</script>

{#if type === MaterialDataTypes.INT || type === MaterialDataTypes.FLOAT}
    <Range
            precision={3}
            variant={"embedded"} minLabelWidth={"50%"}
            integer={type === MaterialDataTypes.INT}
            maxValue={attribute.max}
            incrementPercentage={.001}
            minValue={attribute.min}
            value={value}
            onFinish={v => handleChange(type === MaterialDataTypes.FLOAT ? v : parseInt(v), attribute)}
            label={label}
            disabled={attribute.disabled}
    />
{:else if type === MaterialDataTypes.VEC4 || type === MaterialDataTypes.VEC3 || type === MaterialDataTypes.VEC2}
    <div data-svelteinline="-">
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[0]}
                label={label}
                onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 0, type))}
        />
        <Range
                disabled={attribute.disabled}
                maxValue={attribute.max}
                minValue={attribute.min}
                value={value[1]}
                label={label}
                onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 1, type))}
        />
        {#if type === MaterialDataTypes.VEC4 || type === MaterialDataTypes.VEC3 }
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    value={value[2]}
                    label={label}
                    onFinish={v => handleChange(ShaderEditorUtil.getNewVector(value, v, 2, type))}
            />
        {/if}
        {#if type === MaterialDataTypes.VEC4}
            <Range
                    disabled={attribute.disabled}
                    maxValue={attribute.max}
                    minValue={attribute.min}
                    onFinish={v => handleChange([value[0], value[1], value[2], v])}
                    value={value ? value[3] : undefined}
                    label={label}
            />
        {/if}
    </div>
{:else if type === MaterialDataTypes.COLOR}
    <ColorPicker
            disabled={attribute.disabled}
            label={label}
            submit={({r, g, b}) => handleChange([r/255,g/255,b/255])}
            value={Array.isArray(value) ? value.map(v => v * 255) : value}
            height="25px"
    />

<!--{:else if type === MaterialDataTypes.TEXTURE}-->

<!--    <Selector-->
<!--            disabled={attribute.disabled}-->
<!--            type={"image"}-->
<!--            handleChange={handleChange}-->
<!--            selected={value}-->
<!--    />-->

{:else if type === MaterialDataTypes.OPTIONS && Array.isArray(attribute.options)}
    <Dropdown buttonStyles={"width: 100%;"}>
        <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
            {possibleSelection ? possibleSelection.label : label}
        </button>
        {#each attribute.options as o, i}
            <button data-sveltebuttondefault="-"  on:click={() => handleChange(o.data)} data-svelteinline="-">
                {#if o.data === value}
                    <Icon>check</Icon>
                    {:else}
                    <div style="width: 1.2rem"></div>
                {/if}
                {o.label}
            </button>
        {/each}
    </Dropdown>
{:else if type === MaterialDataTypes.CHECKBOX}
    <Checkbox
            checked={value}
            handleCheck={() => handleChange(!value)}
            disabled={attribute.disabled}
            label={label}
    />
{:else}
    {#if returnDefault}
        {label}
    {/if}
{/if}

