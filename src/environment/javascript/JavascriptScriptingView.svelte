<script lang="ts">
    import PScript from "../../core/PScript.svelte";
    import SideBar from "../../core/components/SideBar.svelte";
    import PScriptStore from "../../core/libs/PScriptStore";
    import PNode from "../../core/libs/PNode";
    import PComment from "../../core/libs/PComment";
    import PScriptRendererState from "../../core/libs/PScriptRendererState";

    const canvas = PScriptRendererState.createState(crypto.randomUUID())

    function onDrop(e: DragEvent) {
        const data = e.dataTransfer.getData("text")
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (data === "COMMENT")
            canvas.addNode(new PComment(x, y, "New comment", [0, 255, 0, 1]))
        else
            canvas.addNode(new PNode(x, y, "New node", [0, 149, 157, 1]))
    }
</script>
<div on:drop={onDrop}>
    <PScript scriptCanvas={canvas}/>
</div>
<SideBar allNodes={[{label: "Comment", dataTransfer: "COMMENT"}, {label: "add", dataTransfer: "cafe"}]}
         scriptCanvas={canvas}/>
