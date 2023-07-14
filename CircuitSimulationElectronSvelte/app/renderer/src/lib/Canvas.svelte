<script lang="ts">
    import { onMount } from 'svelte';
    import { setDevice, windowResize } from "../assets/canvas";

    onMount(setDevice);
</script>

<svelte:window on:resize={windowResize} />

<div class="simcir">
</div>

<style>
    @import '../external/css/simcir.css';
    @import '../external/css/simcir-basicset.css';
</style>

