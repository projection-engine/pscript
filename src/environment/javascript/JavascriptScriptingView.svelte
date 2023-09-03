<script lang="ts">
    import PScript from "../../core/PScript.svelte";
    import JavascriptNodes from "./javascript-nodes";
    import uuid from "uuidv4"
    import registerTypes from "./register-types";
    import {onMount} from "svelte";
    import DynamicNodes from "../../core/components/DynamicNodes.svelte";
    import CanvasStateStore from "../../core/libs/CanvasStateStore";
    import allTypes from "./all-types";

    const canvas = CanvasStateStore.createState(uuid())
    onMount(registerTypes)
</script>
<PScript
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
>
    <DynamicNodes
            types={Object.values(allTypes)}
            slot="dynamic-nodes"
            scriptCanvas={canvas}
    />
</PScript>
