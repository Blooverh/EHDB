<script lang="js" setup>
import HeroSection from '@/components/HeroSection.vue';
import HomePageInfo from '@/components/HomePageInfo.vue';
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
</template>