<script setup>
    import { ChartNoAxesCombined } from 'lucide-vue-next';
    const props = defineProps({
        // Need to add other hardware parts as props when they exist
        cpus: Number,
        servers: Number,
        entries: Number
    });


</script>

<template>
    <div class="container-sm mt-5 mb-5 d-flex flex-column align-items-center">
        <h2 class="info-title fw-bold text-center">Need Hardware Information? You Came to The Right Place!</h2>
        <span class="info-subtitle text-center">Get the most comprehensive and detailed information about Enterprise and high-grade hardware parts and where to find them here at EHDB.</span>
    </div>

    <div class="container-sm mb-5 d-flex flex-row justify-content-center gap-3">
        <div class="entries-box">
            <div class="emblem">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 9.33337C19.799 9.33337 24.5 7.76637 24.5 5.83337C24.5 3.90038 19.799 2.33337 14 2.33337C8.20101 2.33337 3.5 3.90038 3.5 5.83337C3.5 7.76637 8.20101 9.33337 14 9.33337Z" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 5.83337V22.1667C3.5 23.095 4.60625 23.9852 6.57538 24.6416C8.54451 25.298 11.2152 25.6667 14 25.6667C16.7848 25.6667 19.4555 25.298 21.4246 24.6416C23.3938 23.9852 24.5 23.095 24.5 22.1667V5.83337" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 14C3.5 14.9283 4.60625 15.8185 6.57538 16.4749C8.54451 17.1313 11.2152 17.5 14 17.5C16.7848 17.5 19.4555 17.1313 21.4246 16.4749C23.3938 15.8185 24.5 14.9283 24.5 14" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
            </div>
            <span class="info-val">{{ entries }}</span>
            <span class="fw-bold fs-5">Hardware Entries</span>
            <span class="info-subtitle">Comprehensive database of enterprise hadrware</span>
        </div>

        <div class="updates-box">
            <div class="emblem">
                <ChartNoAxesCombined color="white" />
            </div>
            <span class="info-val">Daily</span>
            <span class="fw-bold fs-5">Updates</span>
            <span class="info-subtitle">Latest specifications and Pricing Data</span>
        </div>
    </div>
</template>

<style lang="css" scoped>
    .info-subtitle {
        color: #7c7c7c;
    }

    .entries-box, .updates-box {
        width: 300px;
        background-color: #f3f3f3d0;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        box-shadow: 0px 0px 4px 2px #aaaaaad0;
    }

    .entries-box > .info-subtitle, .updates-box > .info-subtitle {
        text-align: center;
    }

    .emblem{
        background: linear-gradient(to right, cyan, blue);
        padding: 10px;
        border-radius: 8px;
    }

    .info-val {
        font-size: 2rem;
        font-weight: 700;
    }
</style>