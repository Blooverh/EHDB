<script lang="js" setup>
import HeroSection from '@/components/HeroSection.vue';
import HomePageInfo from '@/components/HomePageInfo.vue';
import HardwareBoxHome from '@/components/HardwareBox-home.vue';

import { onMounted, ref } from 'vue';
import axios from 'axios';


const cpus = ref(0); // individual cpu entries
const servers = ref(0); // individual server entries 
const hardwareEntries = ref(0); // all hardware entries

const loading = ref(true);
const error = ref(false);

onMounted(async () => {

    try{
        const cpuResponse = await axios.get(`/api/cpus`);
        const serverResponse = await axios.get('/api/servers');

        cpus.value = cpuResponse.data.totalCPUs;
        servers.value = serverResponse.data.totalServers;
        hardwareEntries.value = servers.value + cpus.value;


    }catch(err){
        console.log(err);
        error.value = true;
    }
});

</script>

<template>
    <HeroSection />
    <HomePageInfo
    :cpus="cpus"
    :servers="servers"
    :entries="hardwareEntries"    
    /> 

    <div class="cat-box d-flex flex-row flex-wrap gap-3 justify-content-center">
        <HardwareBoxHome
        :hardware="cpus"
        hardwareType="Processors"
        subText="Intel, AMD, ARM-based Processors"
        collectionLink="cpus"
        svgTypeClass="svg-box-cpu"
        />

        <HardwareBoxHome
        :hardware="servers"
        hardwareType="Servers"
        subText="Rack, Blade, Towers and HCI Systems"
        collectionLink="servers"
        svgTypeClass="svg-box-servers"
        />

    </div>

</template>