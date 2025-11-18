<script setup>
    import '../assets/css/hardwareCollection.css';
    
    const props = defineProps({
        server: {
            type: Object,
            required: true
        }
    });
</script>

<template>
    <div>
        <div class="title-tags d-flex flex-grow gap-3 align-items-center mt-2">
            <RouterLink class="server-title" :to="`/servers/${server.brand.toLowerCase()}/${server.slug}`">{{ server.brand }} {{ server.model }}</RouterLink>
            <div class="server-tags d-flex flex-row justify-content-center gap-2">
                <p class="tag">{{ server.socketInfo }}</p>
                <p class="tag">{{ server.compatibleCpuGen }}</p>
                <p class="tag">{{ server.motherboardType }}</p>
            </div>
        </div>
    </div>
</template>