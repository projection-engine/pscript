<script lang="ts">
    import PScript from "../../core/PScript.svelte";
    import SideBar from "../../core/components/SideBar.svelte";
    import PScriptRendererState from "../../core/libs/PScriptRendererState";
    import JavascriptNodes from "./javascript-nodes";
    import uuid from "uuidv4"
    import registerTypes from "./register-types";
    import {onMount} from "svelte";
    import ActionBar from "../../core/components/ActionBar.svelte";


    const canvas = PScriptRendererState.createState(uuid())
    onMount(registerTypes)
</script>
<ActionBar {canvas}/>
<PScript
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
/>
<SideBar
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
/>
