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
                <p class="tag" v-for="cpuGen in server.compatibleCpuGen">{{ cpuGen }}</p>
                <p class="tag">{{ server.motherboardType }}</p>
            </div>
        </div>

        <div class="solid-separation"></div>

        <div class="spec-boxes mt-2 d-flex flex-row justify-content-start gap-5">
            <div class="spec-box d-flex flex-column align-items-center">
                <div class="spec-tl">Server Size</div>
                <div class="spec-info">{{ server.serverType }}</div>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <div class="spec-tl">Tech Specs</div>
                <div class="spec-info"><a :href="server.techSpecs">Link</a></div>
                
            </div>
        </div>
    </div>
</template>