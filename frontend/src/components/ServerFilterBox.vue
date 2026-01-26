<script setup>
    // imports
    import { ref, onMounted, Transition} from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';
    

    // state variables for toggling each option
    const isBrandFilterVisible = ref(false);
    const isSocketFilterVisible = ref(false);
    const isCpuGenFilterVisible = ref(false);
    const motherboardTypeFilterVisible = ref(false);
    const memoryTypeFilterVisible = ref(false);
    const speedsFilterVisible = ref(false);

    const route = useRoute(); // returns the current route location
    const router = useRouter(); // returns the router instance allowing for changes like navigating to new URL

    // filters used for this page, each key will store an array of options for specific key 
    const filters = ref({
        brands: [],
        socket: [],
        cpuGen: [],
        moboType: [],
        memoryType: [],
        speeds: []
    });

    // using an empty array we concatenate to that array each value on the query related to such key 
    // if no selection within an option, query does not contain a value related to the key and array remains empty for such key
    const selectedFilters = ref({
        brand: [].concat(route.query.brand || []),
        socket: [].concat(route.query.socket || []),
        cpuGen: [].concat(route.query.cpuGen || []),
        moboType: [].concat(route.query.moboType || []),
        memoryType: [].concat(route.query.memoryType || []),
        speeds: [].concat(parseInt(route.query.speeds) || [])
    }); 

    onMounted( async () => {
        const { data } = await axios.get('/api/servers/filter-options');
        filters.value = data;
    });

    // Function for updating router based on selected options for each filter option
    // also allows router update on deselecting of options
    // makes sure, on deselection, takes user to first page again
    function updateFilters() {
        const query = { ...route.query }; // each key in query object stored in query object

        for( const key in selectedFilters.value){
            const value = selectedFilters.value[key]; // store value for a key in filter selected
            let keyChecker = '';

            if(key === 'memoryType'){
                keyChecker = 'memorySpecs.memory_type';
            }else if(key === 'speeds'){
                keyChecker = 'memorySpecs.speeds';
            }else {
                keyChecker = key;
            }


            // If the filter has a value, add it to the query.
            if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                query[keyChecker] = value;
            } else {
                // Otherwise, remove it from the query.
                delete query[keyChecker];
            }
            
        }

        // A filter change should always reset the user to the first page of results.
        delete query.page;

        // Push the updated query to the router.
        router.push({ query });
    }

    // reset filter function, wipes out all selections and triggers router to first page based on current route

    function resetFilter () {

        selectedFilters.value.brand =[];
        selectedFilters.value.socket = [];
        selectedFilters.value.cpuGen = [];
        selectedFilters.value.moboType = [];
        selectedFilters.value.memoryType =[];
        selectedFilters.value.speeds =[];

        updateFilters();
    }


</script>

<template>
    <div class="filter">
        <div class="filter-box">
            <div class="filter-head mb-3">
                <h3 class="fw-bold mb-2">Filters</h3>
                <button type="button" class="reset" name="reset-filter" @click="resetFilter">Reset</button>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                <p class="fw-bold filter-tl">Brand</p>
                <button type="button" class="toggle-btn" @click="isBrandFilterVisible = !isBrandFilterVisible">
                    {{ isBrandFilterVisible ? 'Hide' : 'Show' }}
                </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isBrandFilterVisible" class="option-box">
                        <div class="input-option" v-for="brand in filters.brands" :key="brand">
                            <input type="checkbox" :id="brand" :value="brand" v-model="selectedFilters.brand" @change="updateFilters">
                            <label :for="brand" class="ml-2">{{ brand }}</label>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>