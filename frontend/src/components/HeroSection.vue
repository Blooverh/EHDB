<script setup>
    import { onMounted, computed, ref } from 'vue';
    import axios from 'axios';

    const error = ref(null);
    const servers = ref(null);
    const cpus = ref(null);

    onMounted(async () => {
        try{
            const serverRes = await axios.get('/api/servers');
            const cpuRes = await axios.get('/api/cpus');
            servers.value = serverRes.data;
            cpus.value = cpuRes.data;

        }catch(err){
            error.value = err.message
        }


    });



</script>

<template>
    <div class="hero-section">
        <div class="hero-box">
            <h1 class="hero-titles">
                <span class="title-a">Enterprise</span>
                <span class="title-b">Hardware</span>
                <span class="title-a">Database</span>
            </h1>

            <h2 class="sub-hero-title">Looking For a One Stop Shop, For Specifications, Comparisons and Insights On Hardware Parts, Such as CPUs, Servers, Storage, and Memory From Leading Manufacturers? This Database Is For you!</h2>
        </div>

        <!-- Search Box -->
        <div class="search-box">
            <input type="text" class="search-input" placeholder="Search for servers, processors, SSDs etc...">
            <button type="button" class="search-btn">
                Search
            </button>
        </div>
        <!-- Info Blocks -->
            <div class="hardware-info-box">
                <div class="server-box">
                    <div v-if="error">
                        <p>Error Fetching Data</p>
                    </div>
                    <div v-else-if="servers" class="box-align">
                        <svg class="server-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3334 1.33325H2.66671C1.93033 1.33325 1.33337 1.93021 1.33337 2.66659V5.33325C1.33337 6.06963 1.93033 6.66659 2.66671 6.66659H13.3334C14.0698 6.66659 14.6667 6.06963 14.6667 5.33325V2.66659C14.6667 1.93021 14.0698 1.33325 13.3334 1.33325Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.3334 9.33325H2.66671C1.93033 9.33325 1.33337 9.93021 1.33337 10.6666V13.3333C1.33337 14.0696 1.93033 14.6666 2.66671 14.6666H13.3334C14.0698 14.6666 14.6667 14.0696 14.6667 13.3333V10.6666C14.6667 9.93021 14.0698 9.33325 13.3334 9.33325Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 4H4.00667" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 12H4.00667" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="box-span">Servers</span>
                        <span class="parts-in-db"> {{ servers.length }}</span>
                    </div>
                    <div v-else>
                        <p>Loading Servers</p>
                    </div>
                </div>
                <div class="cpu-box">
                    <div v-if="error">
                        <p>Error Fetching Data</p>
                    </div>
                    <div v-else-if="cpus" class="box-align">
                        <svg class="cpu-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.66675H3.99996C3.26358 2.66675 2.66663 3.2637 2.66663 4.00008V12.0001C2.66663 12.7365 3.26358 13.3334 3.99996 13.3334H12C12.7363 13.3334 13.3333 12.7365 13.3333 12.0001V4.00008C13.3333 3.2637 12.7363 2.66675 12 2.66675Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.33333 6H6.66667C6.29848 6 6 6.29848 6 6.66667V9.33333C6 9.70152 6.29848 10 6.66667 10H9.33333C9.70152 10 10 9.70152 10 9.33333V6.66667C10 6.29848 9.70152 6 9.33333 6Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 1.33325V2.66659" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 13.3333V14.6666" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.33337 10H2.66671" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.33337 6H2.66671" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.3334 10H14.6667" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.3334 6H14.6667" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 1.33325V2.66659" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="box-span">Processors</span>
                        <span class="parts-in-db"> {{ cpus.length }}</span>
                    </div>
                    <div v-else>
                        <p>Loading Processors</p>
                    </div>
                </div>
            </div>

    </div>
</template>

<style scoped>

    .hero-section {
        background: linear-gradient(to right, rgba(8, 45, 94, 0.9), /* 90% */ rgba(8, 45, 94, 0.7), /* 70% */ rgba(8, 45, 94, 0.5)  /* 50% */), url('../assets/images/Enterprise-Hardware.png');
        background-repeat: no-repeat;
        background-size: cover;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

    }

    .hero-box {
        max-width: 1170px;
    }

    .hero-titles {
        display: flex;
        flex-direction: column;
        gap: 3px;
        align-items: center;
        
    }

    .title-a {
        color: white;
        font-size: 5rem;
        font-weight:  600;
    }

    .title-b {
        background: linear-gradient(to right, cyan, blue);
        font-weight: 600;
        font-size: 5rem;
        background-clip: text;
        color: transparent;
    }

    .sub-hero-title{
        color: white;
        font-size: 1.5rem;
        text-align: center;

    }

    /* Hero Section Number of parts */

    .hardware-info-box{
        display: flex;
        flex-direction: row;
        gap: 20px;
        margin-top: 20px;
        justify-content: center;
    }

        /* Need to add other parts attribute when done */
    .server-box, .cpu-box {
        background-color: #ffffffd0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 8px;
        width: 200px;
        transition: background-color 0.3s ease;
    }

    .server-box:hover, .cpu-box:hover{
        background-color: white;
    }

    .cpu-box:hover .cpu-icon, .server-box:hover .server-icon {
        color: #1AC6FF;
    }

    .box-align{
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }

    .cpu-icon, .server-icon {
        width: 20px;
        color: #082D5E;
        transition: color 0.3s ease;
    }

    .box-span {
        font-weight: 700;
    }

    .parts-in-db{
        font-size: 18px;
        color: #767676;
    }

</style>