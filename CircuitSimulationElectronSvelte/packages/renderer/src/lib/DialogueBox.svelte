<script lang="ts">
    import Modal from "sv-bootstrap-modal";

    export let dialogueBoxName: string;
    export let isOpen: boolean = false;
    export let onOpen: any = () => {};
</script>
  
<Modal 
    bind:open={isOpen}
    dialogClasses="modal-dialog-centered"
    onOpened={onOpen}
>
    <div class="modal-header">
        <h5 class="modal-title">{dialogueBoxName}</h5>
        <button type="button" class="close" on:click={() => (isOpen = false)}>
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <form action="#" on:submit>
        <div class="modal-body">
            <slot />
            <div class="alert alert-danger" role="alert" style="display: none;">
                Invalid Input
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={() => (isOpen = false)}>Close</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
    </form>
</Modal>
  
