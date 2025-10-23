<script setup>
    import '../assets/css/hardwareCollection.css';
    import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle';

    const props = defineProps({
        cpu: {
            type: Object,
            required: true
        }
    });

</script>

<template>
    <div>
        <div class="title-tags d-flex flex-row gap-3 align-items-center mt-2">
            <RouterLink class="cpu-title" :to="`/cpus/${cpu.brand}/${cpu.slug}`">{{ cpuBrandFormatter(cpu.brand )}} {{ formatModel(cpu.model) }}</RouterLink>
            <div class="cpu-tags d-flex flex-row justify-content-between gap-2">
                <p class="tag">{{ cpu.generation }}</p>
                <p class="tag">{{ cpu.socket }}</p>
                <p class="tag">{{ cpu.tdp }}W</p>
                <p class="tag">{{ cpu.cache.cacheL3 }}</p>
            </div>
        </div>
        <div class="solid-separation"></div>
        <div class="spec-boxes mt-2 d-flex flex-row justify-content-between gap-2">
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Cores</span>
                <span class="spec-info">{{ cpu.coreNum }}C</span>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Threads</span>
                <span class="spec-info">{{ cpu.threadNum }}T</span>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Max RAM Speed</span>
                <span class="spec-info">{{ cpu.ratedSpeeds }}MT/s</span>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Base Clock</span>
                <span class="spec-info">{{ cpu.frequency }}GHz</span>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Turbo Clock</span>
                <span class="spec-info">{{ cpu.turboFrequency }}GHz</span>
            </div>
            <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">MPN</span>
                <span class="spec-info">{{ cpu.partNum }}</span>
            </div>
        </div>
    </div>
</template>