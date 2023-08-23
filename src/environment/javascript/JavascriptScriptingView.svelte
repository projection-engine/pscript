<script lang="ts">
    import PScript from "../../core/PScript.svelte";
    import SideBar from "../../core/components/SideBar.svelte";
    import PScriptRendererState from "../../core/libs/PScriptRendererState";
    import JavascriptNodes from "./javascript-nodes";

    const canvas = PScriptRendererState.createState(crypto.randomUUID())


</script>
<PScript
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
/>
<SideBar
        allNodes={JavascriptNodes}
        scriptCanvas={canvas}
/>
