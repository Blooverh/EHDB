<script setup>
    import '../assets/css/verticalCard.css';
    import { Server, Book, Cpu, Ruler, MemoryStickIcon, NetworkIcon } from 'lucide-vue-next';

    // props for server information
    const props = defineProps({
        server:{
            type: Object,
            required: true
        }
    });

    const serverName = `${props.server.brand} ${ props.server.model }`;

</script>

<template>
    <div class="card d-flex justify-content-between">
        <div class="img-box d-flex justify-content-center">
            <!-- Image element -->
             <img :src="server.featureImg" :alt="serverName">
        </div>

        <div class="info-box d-flex flex-column gap-3 p-2">
            
            <RouterLink class="server-title" :to="`/servers/${server.brand.toLowerCase()}/${server.slug}`">
            {{ server.brand }} {{ server.model }}
            </RouterLink> 

            <div class="container">
                <div class="row">
                    <!-- Col 1 - CPU, SSD Interfaces, cpu Gen -->
                    <div class="col">
                        <div class="icon-spec">
                            <!-- icon -->
                            <Server class="icon-color"/>
                            <!-- spec -->
                            <span class="spec">{{ server.brand }}</span>
                        </div>
                        <div class="icon-spec">
                            <!-- icon -->
                            <NetworkIcon class="icon-color"/>
                            <!-- spec -->
                            <span class="spec">{{ server.socketInfo }}</span>
                        </div>

                        <div class="icon-spec">
                            <!-- icon -->
                            <Ruler class="icon-color" />
                            <!-- spec -->
                            <span class="spec">{{ server.serverType }}</span>
                        </div>

                    </div>
                    <!-- Col 2 - Socket,  Server Type, Motherboard Type -->
                    <div class="col">
                        <div class="icon-spec">
                            <!-- icon -->
                            <Cpu class="icon-color" />
                            <!-- spec -->
                            <span class="spec">
                                {{ server.compatibleCpuGen.length }} CPU 
                                {{ server.compatibleCpuGen.length > 1 ? 'Generations' : 'Generation' }}
                            </span>
                        </div>

                        <div class="icon-spec">
                            <!-- icon -->
                             <MemoryStickIcon class="icon-color"/>
                            <!-- spec -->
                            <span class="spec">{{ server.motherboardType }}</span>
                        </div>

                        <div class="icon-spec">
                            <!-- icon -->
                            <Book class="icon-color" />
                            <!-- spec -->
                            <span class="spec"><a :href="server.techSpecs">Specs Guide</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <RouterLink class="server-link" :to="`/servers/${server.brand.toLowerCase()}/${server.slug}`">
            View Server Details
        </RouterLink> 
    </div>
</template>