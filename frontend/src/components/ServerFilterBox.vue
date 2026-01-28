<script setup>
    // imports
    import { ref, onMounted, Transition, defineExpose} from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';
    

    // state variables for toggling each option
    const isBrandFilterVisible = ref(false);
    const isSocketFilterVisible = ref(false);
    const isCpuGenFilterVisible = ref(false);
    const isMotherboardTypeFilterVisible = ref(false);
    const isMemoryTypeFilterVisible = ref(false);
    const isSpeedsFilterVisible = ref(false);
    const isStorageFilterVisible = ref(false);

    const route = useRoute(); // returns the current route location
    const router = useRouter(); // returns the router instance allowing for changes like navigating to new URL

    // filters used for this page, each key will store an array of options for specific key 
    const filters = ref({
        brands: [],
        socket: [],
        cpuGen: [],
        moboType: [],
        memoryType: [],
        speeds: [],
        ssdInterfaces: []
    });

    // using an empty array we concatenate to that array each value on the query related to such key 
    // if no selection within an option, query does not contain a value related to the key and array remains empty for such key
    const selectedFilters = ref({
        brand: [].concat(route.query.brand || []),
        socket: [].concat(route.query.socket || []),
        cpuGen: [].concat(route.query.cpuGen || []),
        moboType: [].concat(route.query.moboType || []),
        memoryType: [].concat(route.query.memoryType || []),
        speeds: [].concat(parseInt(route.query.speeds) || []), 
        ssdInterfaces: [].concat(route.query.ssdInterfaces || [])
    }); 

    onMounted( async () => {
        const { data } = await axios.get('/api/servers/filter-options');
        filters.value = data;
    });

    // Function for updating router based on selected options for each filter option
    // also allows router update on deselecting of options
    // makes sure, on deselection, takes user to first page again
    /* 
        We assign to our keys on the filter component the actual properties of the server model
        to correctly filter the collection when route is changed to a filtered route

        - This case happens because variables in this component have different names from the 
        property names of the server DB model.
    */
    function updateFilters() {
        const query = { ...route.query }; // each key in query object stored in query object

        for( const key in selectedFilters.value){
            const value = selectedFilters.value[key]; // store value for a key in filter selected
            let keyChecker = '';


            // get correct model properties for filtering
            if(key === 'memoryType'){
                keyChecker = 'memorySpecs.memory_type';
            }else if(key === 'speeds'){
                keyChecker = 'memorySpecs.speeds';
            } else if (key === 'socket') {
                keyChecker = 'socketInfo';
            } else if (key === 'cpuGen') {
                keyChecker = 'compatibleCpuGen';
            }else if (key === 'moboType'){
                keyChecker = 'motherboardType';
            }else if(key === 'ssdInterfaces'){ // possible to be deleted as it has the same name as model property
                keyChecker = 'ssdInterfaces';
            }
            else {
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
        selectedFilters.value.ssdInterfaces = [];

        updateFilters();
    }

    defineExpose({
        resetFilter
    });


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
                        <div class="input-option d-flex gap-2" v-for="brand in filters.brands" :key="brand">
                            <input type="checkbox" :id="brand" :value="brand" v-model="selectedFilters.brand" @change="updateFilters">
                            <label :for="brand" class="ml-2">{{ brand }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl">CPU Socket</p>
                    <button type="button" class="toggle-btn" @click="isSocketFilterVisible = !isSocketFilterVisible">
                        {{ isSocketFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isSocketFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="socket in filters.socket" :key="socket">
                            <input type="checkbox" :id="socket" :value="socket" v-model="selectedFilters.socket" @change="updateFilters">
                            <label :for="socket" class="ml-2">{{ socket }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl">CPU Generation</p>
                    <button type="button" class="toggle-btn" @click="isCpuGenFilterVisible = !isCpuGenFilterVisible">
                        {{ isCpuGenFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isCpuGenFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="cpuGen in filters.cpuGen" :key="cpuGen">
                            <input type="checkbox" :id="cpuGen" :value="cpuGen" v-model="selectedFilters.cpuGen" @change="updateFilters">
                            <label :for="cpuGen" class="ml-2">{{ cpuGen }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl"> SSD Interface Compatibility</p>
                    <button type="button" class="toggle-btn" @click="isStorageFilterVisible = !isStorageFilterVisible">
                        {{ isStorageFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isStorageFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="ssd in filters.ssdInterfaces" :key="ssd">
                            <input type="checkbox" :id="ssd" :value="ssd" v-model="selectedFilters.ssdInterfaces" @change="updateFilters">
                            <label :for="ssd" class="ml-2">{{ ssd }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl">Motherboard Memory Type</p>
                    <button type="button" class="toggle-btn" @click="isMotherboardTypeFilterVisible = !isMotherboardTypeFilterVisible">
                        {{ isMotherboardTypeFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isMotherboardTypeFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="mobo in filters.moboType" :key="mobo">
                            <input type="checkbox" :id="mobo" :value="mobo" v-model="selectedFilters.moboType" @change="updateFilters">
                            <label :for="mobo" class="ml-2">{{ mobo }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl">Compatible Memory Speeds</p>
                    <button type="button" class="toggle-btn" @click="isSpeedsFilterVisible = !isSpeedsFilterVisible">
                        {{ isSpeedsFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isSpeedsFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="speed in filters.speeds" :key="speed">
                            <input type="checkbox" :id="speed" :value="speed" v-model="selectedFilters.speeds" @change="updateFilters">
                            <label :for="speed" class="ml-2">{{ speed }}MT/s</label>
                        </div>
                    </div>
                </Transition>
            </div>

            <div class="mb-4 brand-box">
                <div class="filter-header">
                    <p class="fw-bold filter-tl">Compatible Memory Types</p>
                    <button type="button" class="toggle-btn" @click="isMemoryTypeFilterVisible = !isMemoryTypeFilterVisible">
                        {{ isMemoryTypeFilterVisible ? 'Hide' : 'Show' }}
                    </button>
                </div>

                <Transition name="slide-fade">
                    <div v-if="isMemoryTypeFilterVisible" class="option-box">
                        <div class="input-option d-flex gap-2" v-for="memType in filters.memoryType" :key="memType">
                            <input type="checkbox" :id="memType" :value="memType" v-model="selectedFilters.memoryType" @change="updateFilters">
                            <label :for="memType" class="ml-2">{{ memType }}</label>
                        </div>
                    </div>
                </Transition>
            </div>

        </div>
    </div>
</template>