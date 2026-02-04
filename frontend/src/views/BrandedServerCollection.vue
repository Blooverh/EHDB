<script setup>
    import '../assets/css/hardwareCollection.css';
    import { ref, watch, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';    
    import axios from 'axios';
    import BrandedServerFilterBox from '@/components/BrandedServerFilterBox.vue';
    import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next';
    import ServerVerticalCard from '@/components/serverVerticalCard.vue';

    const router = useRouter();
    const route = useRoute();

    const filterBox = ref(null);
    
    const servers = ref([]);

    

</script>

<template>
    Server Collection
</template>