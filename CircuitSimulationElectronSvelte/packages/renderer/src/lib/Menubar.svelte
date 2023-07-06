<script lang="ts">
  import { 
    isRegisterDeviceDialogueBoxOpen,
    isUnregisterDeviceDialogueBoxOpen,
    isNewDeviceDialogueBoxOpen
  } from "../assets/stores";
  import * as eventHandler from '../assets/menubar';
  import DialogueBox from './DialogueBox.svelte';
</script>

<DialogueBox 
  dialogueBoxName="Resgister Device" 
  bind:isOpen={$isRegisterDeviceDialogueBoxOpen}
  on:submit={eventHandler.registerDeviceFormSubmit}
>
  <div class="form-group">
    <label for="deviceName" class="col-form-label">Device Name:</label>
    <input type="text" class="form-control" id="deviceName" required>
  </div>
  <div class="form-group">
    <label for="deviceWidth" class="col-form-label">Circuit Width:</label>
    <input type="number" class="form-control" id="deviceWidth" min="200" max="600" required>
  </div>
  <div class="form-group">
    <label for="deviceHeight" class="col-form-label">Circuit Height:</label>
    <input type="number" class="form-control" id="deviceHeight" min="200" max="600" required>
  </div> 
</DialogueBox>

<DialogueBox 
  dialogueBoxName="Unresgister Device" 
  bind:isOpen={$isUnregisterDeviceDialogueBoxOpen}
  onOpen={eventHandler.onUnregisterDeviceDialogueBoxOpen}
  on:submit={eventHandler.unregisterDeviceFormSubmit}
>
  <div class="form-group">
    <label for="selectRegisteredDevice">Select Device</label>
    <select class="form-control" id="selectRegisteredDevice">
  </select>
</DialogueBox>

<DialogueBox 
  dialogueBoxName="New Device" 
  bind:isOpen={$isNewDeviceDialogueBoxOpen}
  on:submit={eventHandler.newDeviceFormSubmit}
>
  <div class="form-group">
    <label for="selectNewDevice">Select Device</label>
    <select class="form-control" id="selectNewDevice">
      <option>AND</option>
      <option>NAND</option>
      <option>OR</option>
      <option>NOR</option>
      <option>XOR</option>
      <option>XNOR</option>
    </select>
  </div>
  <div class="form-group">
    <label for="deviceLabel" class="col-form-label">Device Label:</label>
    <input type="text" class="form-control" id="deviceLabel" required>
  </div>
  <div class="form-group">
    <label for="numberOfInputs" class="col-form-label">Number of inputs:</label>
    <input type="number" class="form-control" id="numberOfInputs" min="2" required>
  </div>
</DialogueBox>

<!-- Menu Bar -->
<nav class="navbar sticky-top navbar-expand navbar-light bg-light">
  <span class="navbar-brand">Circuit Simulation</span>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapsingContent" aria-controls="navbarCollapsingContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarCollapsingContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <span class="nav-link dropdown-toggle" id="navbarViewMenu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          View
        </span>
        <div class="dropdown-menu" aria-labelledby="navbarViewMenu">
          <button class="dropdown-item" on:click={eventHandler.zoomInClick}>Zoom In</button>
          <button class="dropdown-item" on:click={eventHandler.zoomOutClick}>Zoom Out</button>
        </div>
      </li>
      <li class="nav-item dropdown">
        <span class="nav-link dropdown-toggle" id="navbarToolsMenu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Tools
        </span>
        <div class="dropdown-menu" aria-labelledby="navbarToolsMenu">
          <button class="dropdown-item" on:click={() => ($isRegisterDeviceDialogueBoxOpen = true)}>Register Device</button>
          <button class="dropdown-item" on:click={() => ($isUnregisterDeviceDialogueBoxOpen = true)}>Unregister Device</button>
          <button class="dropdown-item" on:click={() => ($isNewDeviceDialogueBoxOpen = true)}>New Device</button>
        </div>
      </li>
    </ul>
  </div>
</nav>

<style>
  button:focus{
    outline: 0px;
  }
</style>