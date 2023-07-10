<script lang="ts">
    import { onMount } from 'svelte';
    import { setSimcirDiv, setCircuitData, windowResize } from "../assets/canvas";

    onMount(() => {
        setSimcirDiv();
        setCircuitData({
            "width": window.innerWidth,
            "height": window.innerHeight - document.querySelector(".navbar").clientHeight
        });
    });
</script>

<svelte:window on:resize={windowResize} />

<div class="simcir">
</div>

