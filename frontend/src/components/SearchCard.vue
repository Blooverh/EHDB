<script setup>
import { formatModel } from '@/utils/formatCpuTitle';
import "../assets/css/search-card.css";
import { Cpu, Server, Gpu, RefreshCcw, ArrowBigRight } from 'lucide-vue-next';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    type: {
        type: String,
        required: true,
        validator: (value) => ['cpu', 'gpu', 'server'].includes(value)
    }
});

</script>


<template>

    <div class="search-card container d-flex justify-content-between">
        <div class="svg-icon">
            <Cpu v-if="type === 'cpu'"/>
            <Gpu v-else-if="type === 'gpu'" />
            <Server v-else-if="type === 'server'" />
            <RefreshCcw v-else />
        </div>

        <div class="item-title">
            <div class="item-brand">{{ item.brand }}</div>
            <div class="item-model">{{ formatModel(item.model) }}</div>
        </div>

        <RouterLink v-if="type === 'cpu'" class="item-link" :to="`cpus/${item.brand.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`">Explore <ArrowBigRight/></RouterLink>
        <RouterLink v-else-if="type === 'gpu'" class="item-link" :to="`gpus/${item.brand.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`"> Explore</RouterLink>
        <RouterLink v-else-if="type === 'server'" class="item-link" :to="`servers/${item.brand.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`">Explore</RouterLink>
    </div>
</template>
