<script setup>

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
        
            <!-- Search Box -->

            <!-- Info Blocks -->
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

</style>