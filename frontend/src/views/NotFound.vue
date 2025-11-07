<script setup>

    import { Search } from 'lucide-vue-next';

</script>

<template>
    <div class="notFound-section d-flex justify-content-center align-items-center">
        <div class="notFoundBox d-flex flex-column mb-2 align-items-center">
            <div class="notFound-header d-flex flex-row gap-2 align-items-center">
                <div class="vector-box">
                    <div class="vector p-2">
                        <svg width="35" height="35" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 9.33337C19.799 9.33337 24.5 7.76637 24.5 5.83337C24.5 3.90038 19.799 2.33337 14 2.33337C8.20101 2.33337 3.5 3.90038 3.5 5.83337C3.5 7.76637 8.20101 9.33337 14 9.33337Z" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 5.83337V22.1667C3.5 23.095 4.60625 23.9852 6.57538 24.6416C8.54451 25.298 11.2152 25.6667 14 25.6667C16.7848 25.6667 19.4555 25.298 21.4246 24.6416C23.3938 23.9852 24.5 23.095 24.5 22.1667V5.83337" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 14C3.5 14.9283 4.60625 15.8185 6.57538 16.4749C8.54451 17.1313 11.2152 17.5 14 17.5C16.7848 17.5 19.4555 17.1313 21.4246 16.4749C23.3938 15.8185 24.5 14.9283 24.5 14" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div class=" d-flex flex-column">
                    <h2 class="header-title">EHDB</h2>
                    <span class="sub-title">Enterprise Hardware Database</span>
                </div>
            </div>
            <div class="notFound-alert d-flex flex-column gap-3 align-items-center mb-2">
                <span class="status-code">404</span>
                <span class="status-msg">Page Not Found</span>
                <span class="status-sub-msg">The hardware part you're looking for does not exist in our Database YET!</span>
            </div>
            <div class="d-flex flex-row gap-3 notFound-btns">
                <!-- Create 2 buttons: home page buttons and search page button -->
                 <RouterLink class="d-flex flex-row justify-content-center align-items-center homebutton gap-2" to="/">
                    <svg width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 14V8.66667C10 8.48986 9.92976 8.32029 9.80474 8.19526C9.67971 8.07024 9.51014 8 9.33333 8H6.66667C6.48986 8 6.32029 8.07024 6.19526 8.19526C6.07024 8.32029 6 8.48986 6 8.66667V14" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 6.66673C1.99995 6.47277 2.04222 6.28114 2.12386 6.1052C2.20549 5.92927 2.32453 5.77326 2.47267 5.64806L7.13933 1.64873C7.37999 1.44533 7.6849 1.33374 8 1.33374C8.3151 1.33374 8.62001 1.44533 8.86067 1.64873L13.5273 5.64806C13.6755 5.77326 13.7945 5.92927 13.8761 6.1052C13.9578 6.28114 14 6.47277 14 6.66673V12.6667C14 13.0203 13.8595 13.3595 13.6095 13.6095C13.3594 13.8596 13.0203 14.0001 12.6667 14.0001H3.33333C2.97971 14.0001 2.64057 13.8596 2.39052 13.6095C2.14048 13.3595 2 13.0203 2 12.6667V6.66673Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>    
                    <span>Return Home</span>
                </RouterLink>

                <RouterLink class="d-flex flex-row justify-content-center align-items-center search-part gap-2" to="/search">
                    <Search style="stroke: black;"/>
                    <span>Search Database</span>
                </RouterLink>

            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>

    .notFound-section {
        height: 100vh;
    }

    .notFoundBox{
        width: 600px;
    }

    .vector{
        background: linear-gradient(to right, cyan, blue);
        border-radius: 8px;
    }

    .header-title {
        font-size: 30px;
        font-weight: 700;
    }

    .status-code {
        font-size: 10rem;
    }

    .status-msg {
        font-size: 3rem;
        font-weight: 700;
    }

    .status-sub-msg{
        font-size: 1.2rem;
        text-align: center;
        color: rgb(128, 128, 128);
    }

    .notFoundBtns {
        text-decoration: none;
    }

    .homebutton{
        background: linear-gradient(to right, cyan, blue);
        padding: 10px;
        border-radius: 8px;
    }

    .search-part {
        padding: 10px;
        border-radius: 8px;
        background: rgba(160, 160, 160, 0.682);
    }

    .homebutton > span, .search-part > span {
        color: white;
        font-size: 1.3em;
        font-weight: 700;
    }

    .search-part > span {
        color: black;
    }

    .homebutton:hover, .search-part:hover {
        text-decoration: none !important;
        
    }

    .homebutton:hover {
        background: linear-gradient(to right, rgba(0, 255, 255, 0.434), rgba(0, 0, 255, 0.512));
    }

    .search-part:hover{
        background: rgba(128, 128, 128, 0.88);
    }

</style>