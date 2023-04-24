<div class="shadow bg-gray-100 p-4 md:p-10 rounded-2xl flex flex-col {className}">
    <slot></slot>
</div>

<script lang="ts">
    export let className: string = "";
</script>
