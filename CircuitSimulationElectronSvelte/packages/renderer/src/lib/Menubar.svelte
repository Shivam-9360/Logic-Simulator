<script lang="ts">
  import { 
      FormGroup, 
      Label, 
      Input, 
      Navbar, 
      NavbarBrand, 
      NavbarToggler, 
      Collapse, 
      Nav, 
      Dropdown, 
      DropdownItem, 
      DropdownMenu, 
      DropdownToggle 
  } from "sveltestrap";
  import { 
      isRegisterDeviceDialogueBoxOpen,
      isUnregisterDeviceDialogueBoxOpen,
      isNewDeviceDialogueBoxOpen
  } from "../assets/stores";    
  import * as eventHandler from '../assets/menubar';
  import DialogueBox from "./DialogueBox.svelte";

  let isMenuBarOpen: boolean = true;
</script>

<DialogueBox
  dialogueBoxName="Resgister Device" 
  bind:isOpen={$isRegisterDeviceDialogueBoxOpen}
  on:submit={eventHandler.registerDeviceFormSubmit}
>
  <FormGroup>
    <Label for="deviceName">Device Name:</Label>
    <Input type="text" id="deviceName" required />
  </FormGroup>   
  <FormGroup>
    <Label for="deviceWidth">Circuit Width:</Label>
    <Input type="number" id="deviceWidth" min={200} max={600} required />
  </FormGroup> 
  <FormGroup>
    <Label for="deviceHeight">Circuit Height:</Label>
    <Input type="number" id="deviceHeight" min={200} max={600} required />
  </FormGroup> 
</DialogueBox>

<DialogueBox 
  dialogueBoxName="Unresgister Device" 
  bind:isOpen={$isUnregisterDeviceDialogueBoxOpen}
  on:submit={eventHandler.unregisterDeviceFormSubmit}
  onOpen={eventHandler.onUnregisterDeviceDialogueBoxOpen}
>
  <FormGroup>
    <Label for="selectRegisteredDevice">Select</Label>
    <Input type="select" id="selectRegisteredDevice">
    </Input>
  </FormGroup>
</DialogueBox>

<DialogueBox 
  dialogueBoxName="New Device" 
  bind:isOpen={$isNewDeviceDialogueBoxOpen}
  on:submit={eventHandler.newDeviceFormSubmit}
>
  <FormGroup>
    <Label for="selectNewDevice">Select</Label>
    <Input type="select" id="selectNewDevice">
      <option>AND</option>
      <option>NAND</option>
      <option>OR</option>
      <option>NOR</option>
      <option>XOR</option>
      <option>XNOR</option>
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="deviceLabel">Device Name:</Label>
    <Input type="text" id="deviceLabel" required />
  </FormGroup>  
  <FormGroup>
    <Label for="numberOfInputs">Circuit Height:</Label>
    <Input type="number" id="numberOfInputs" min={2} required />
  </FormGroup> 
</DialogueBox>

<!-- Menu Bar -->
<Navbar
  sticky="top"
  color="light"
  light
  expand
>
  <NavbarBrand href="#">Circuit Simulation</NavbarBrand>
  <NavbarToggler on:click={() => (isMenuBarOpen = !isMenuBarOpen)}></NavbarToggler>
  <Collapse navbar isOpen={isMenuBarOpen}>
    <Nav navbar>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>View</DropdownToggle>
        <DropdownMenu>
          <DropdownItem on:click={eventHandler.zoomInClick}>Zoom In</DropdownItem>
          <DropdownItem on:click={eventHandler.zoomOutClick}>Zoom Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>Tools</DropdownToggle>
        <DropdownMenu>
          <DropdownItem on:click={() => ($isRegisterDeviceDialogueBoxOpen = true)}>Register Device</DropdownItem>
          <DropdownItem on:click={() => ($isUnregisterDeviceDialogueBoxOpen = true)}>Unregister Device</DropdownItem>
          <DropdownItem on:click={() => ($isNewDeviceDialogueBoxOpen = true)}>New Device</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>