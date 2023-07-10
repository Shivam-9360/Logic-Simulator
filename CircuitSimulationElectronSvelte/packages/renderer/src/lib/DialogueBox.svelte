<script lang="ts">
    import { 
        Button, 
        Modal, 
        ModalBody, 
        ModalFooter, 
        ModalHeader,
        Alert,
        Form
    } from 'sveltestrap';
    
    export let dialogueBoxName: string;
    export let onOpen: any = () => {};
    export let isOpen: boolean = false;
</script>

<Modal 
    bind:isOpen={isOpen} 
    centered={true}
    on:open={onOpen}
>
    <ModalHeader toggle={() => (isOpen = false)}>{dialogueBoxName}</ModalHeader>
    <Form action="#" on:submit>
        <ModalBody>
        <slot />
        <Alert color="danger" isOpen={false} dismissible>Invalid Input</Alert>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" on:click={() => (isOpen = false)}>Close</Button>
            <Button type="submit" color="primary">Save changes</Button>
        </ModalFooter>
    </Form>
</Modal>