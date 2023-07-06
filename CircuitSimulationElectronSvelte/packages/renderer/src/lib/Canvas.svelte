<script lang="ts">
    import { onMount } from 'svelte';
    import { simcir, simcirDiv } from "../assets/stores";
    import { setCircuitData, windowResize } from "../assets/canvas";

    onMount(() => {
        $simcir = window.simcir;
        $simcirDiv = document.querySelector(".simcir");

        setCircuitData({
            "width": window.innerWidth,
            "height": window.innerHeight - document.querySelector(".navbar").clientHeight
        });
    });
</script>

<svelte:window on:resize={windowResize} />

<div class="simcir">
</div>

