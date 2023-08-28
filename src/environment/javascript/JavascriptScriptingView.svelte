<script lang="ts">
    import PScript from "../../core/PScript.svelte";
    import SideBar from "../../core/components/ResourcesSideBar.svelte";
    import CanvasStateManager from "../../core/libs/CanvasStateManager";
    import JavascriptNodes from "./javascript-nodes";
    import uuid from "uuidv4"
    import registerTypes from "./register-types";
    import {onMount} from "svelte";
    import ActionBar from "../../core/components/ActionBar.svelte";


    const canvas = CanvasStateManager.createState(uuid())
    onMount(registerTypes)
</script>
<PScript
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
/>
