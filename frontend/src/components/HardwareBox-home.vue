<script setup>

    import { ArrowRight } from 'lucide-vue-next';

    const props = defineProps({
        hardware: Number,
        hardwareType: String, 
        subText: String,
        collectionLink: String,
        svgTypeClass: String
    });


</script>

<template>
    <div class="custom-box mb-5">
        <div class="d-flex flex-row justify-content-between flex-wrap">
            <!-- Contains SVG and arrow with link -->
            <div :class="`${ svgTypeClass }`">
                <svg v-if="hardwareType == 'Processors'" width="50" height="50" viewBox="-4 -4 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.66675H3.99996C3.26358 2.66675 2.66663 3.2637 2.66663 4.00008V12.0001C2.66663 12.7365 3.26358 13.3334 3.99996 13.3334H12C12.7363 13.3334 13.3333 12.7365 13.3333 12.0001V4.00008C13.3333 3.2637 12.7363 2.66675 12 2.66675Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.33333 6H6.66667C6.29848 6 6 6.29848 6 6.66667V9.33333C6 9.70152 6.29848 10 6.66667 10H9.33333C9.70152 10 10 9.70152 10 9.33333V6.66667C10 6.29848 9.70152 6 9.33333 6Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 1.33325V2.66659" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 13.3333V14.6666" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.33337 10H2.66671" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.33337 6H2.66671" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.3334 10H14.6667" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.3334 6H14.6667" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 1.33325V2.66659" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg v-else-if="hardwareType == 'Servers'" width="50" height="50" viewBox="-4 -4 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3334 1.33325H2.66671C1.93033 1.33325 1.33337 1.93021 1.33337 2.66659V5.33325C1.33337 6.06963 1.93033 6.66659 2.66671 6.66659H13.3334C14.0698 6.66659 14.6667 6.06963 14.6667 5.33325V2.66659C14.6667 1.93021 14.0698 1.33325 13.3334 1.33325Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.3334 9.33325H2.66671C1.93033 9.33325 1.33337 9.93021 1.33337 10.6666V13.3333C1.33337 14.0696 1.93033 14.6666 2.66671 14.6666H13.3334C14.0698 14.6666 14.6667 14.0696 14.6667 13.3333V10.6666C14.6667 9.93021 14.0698 9.33325 13.3334 9.33325Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 4H4.00667" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 12H4.00667" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <RouterLink :to="`/${ collectionLink }`"><ArrowRight color="gray" /> </RouterLink>
        </div>
        <h4 class="fw-bold">{{ hardwareType }}</h4>
        <p class="sub-text">{{ subText }}</p>
        <div class="d-flex justify-content-between">
            <span class="items">{{ hardware }} items</span>
            <RouterLink :to="`/${ collectionLink }`" class="browse-link">Browse</RouterLink>
        </div>
    </div>
</template>

<style scoped>

    .custom-box{
        width: 440px;
        background-color: #f3f3f3d0;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0px 0px 4px 2px #aaaaaad0;
    }
    .sub-text{
        color: gray;
    }

    .browse-link {
        color: #1AC6FF;
    }

    .svg-box-servers {
        background: linear-gradient(to right, #10B981, #0D9488);
        width: 50px;
        height: 50px;
        border-radius: 8px;
    } 
    .svg-box-cpu {
        background: linear-gradient(to right, #3B82F6, #4F46E5);;
        width: 50px;
        height: 50px;
        border-radius: 8px;
    }

    .lucide-arrow-right:hover {
        stroke: #1AC6FF !important;
    }

</style>

