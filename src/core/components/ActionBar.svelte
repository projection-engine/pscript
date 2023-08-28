<script lang="ts">
    import Icon from "../../components/icon/Icon.svelte";
    import Serializer from "../libs/Serializer";
    import CanvasRenderEngine from "../CanvasRenderEngine";
    import CanvasStateManager from "../libs/CanvasStateManager";

    export let canvas: CanvasRenderEngine
    let fileInput: HTMLInputElement;
    const onFileSelected = (e) => {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(image);
        reader.onload = e => {
            canvas.stop()
            canvas.clearState()
            CanvasStateManager.setState(canvas, Serializer.deserialize(canvas, e.target.result.toString()))
            canvas.start()
        };
    }
    const upload = () => {
        fileInput.click()
    }
    const download = () => {
        const file = new File([Serializer.serialize(canvas.getState())], 'STATE.json', {type: 'text/plain',})

        const link = document.createElement('a')
        const url = URL.createObjectURL(file)

        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
</script>

<div class="wrapper">
    <button data-sveltebuttondefault="-" on:click={download}>
        <Icon>file_download</Icon>
        Export
    </button>
    <button data-sveltebuttondefault="-" on:click={upload}>
        <Icon>file_upload</Icon>
        Import
    </button>
    <input
            style="display:none"
            type="file"
            accept=".json"
            on:change={onFileSelected} bind:this={fileInput}
    >
</div>

<style>
    .wrapper{
        height: 35px;
        display: flex;
        align-items: center;
        padding: 4px;
        gap: 4px;
        border-bottom: var(--pj-border-primary) 1px solid;
    }

</style>
