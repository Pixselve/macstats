<div class="shadow bg-primary p-4 sm:p-10 rounded-lg flex flex-col space-y-4 sm:space-y-10 {className}">
    <slot></slot>
</div>

<script lang="ts">
    export let className: string = "";
</script>
