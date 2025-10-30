<script setup>
    
    import { Transition, ref } from 'vue';
    const props = defineProps({
        filters: {
            type: Object,
            required: true,
            default: {
                codename: [],
                generation: [],
                socket: [],
                coreNum: [],
                ratedSpeeds: [],
                memorySupport: [],
                cache: []
            }
        }, 
        selectedFilters: {
            type: Object, 
            required: true
        }
    });

    // State for toggling the brand filter visibility
        const isGenFilterVisible = ref(false);
        const isCoreFilterVisible = ref(false);
        const isCodenameFilterVisible = ref(false);
        const isRatedSpeedsFilterVisible = ref(false);
        const isMemSupportFilterVisible = ref(false);
        const isSocketFilterAvailable = ref(false);
        const isCacheFilterAvailable = ref(false);

    // defining event that this component can emit 
    const emit = defineEmits(['filters-changed', 'reset-filter']);

    // 3. This function is called whenever a user clicks a checkbox
    const handleFilterChange = (filterType, value) => {
      // Create a deep copy of the selected filters to avoid mutating the prop directly
      const newFilters = JSON.parse(JSON.stringify(props.selectedFilters));

      // Ensure that array exists
      if(!Array.isArray(newFilters[filterType])){
        newFilters[filterType] = [];
      }
   
      // Get the specific array of filters (e.g., the 'codename' array)
      const filterArray = newFilters[filterType];
      const index = filterArray.indexOf(value);
   
      if (index === -1) {
        // If the value isn't in the array, add it
        filterArray.push(value);
      } else {
        // If it is in the array, remove it
        filterArray.splice(index, 1);
      }
   
      // 4. Emit the 'filters-changed' event with the updated filters object as the payload
      emit('filters-changed', newFilters);

    };

    const resetFilter = () => {
        emit('reset-filter');
    }
    
</script>

<template>
    <div>
        <div class="filter">
            <div class="filter-box">
                <div class="filter-head mb-3">
                    <h3 class="fw-bold mb-2">Filters</h3>
                    <button type="button" class="reset" @click="resetFilter ">Reset</button>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Code Name</p>
                        <button type="button" class="toggle-btn" @click="isCodenameFilterVisible = !isCodenameFilterVisible">
                            {{ isCodenameFilterVisible ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isCodenameFilterVisible" class="option-box">
                            <div class="input-option" v-for="name in filters.codename" :key="name">
                                <input type="checkbox" :id="`codename-${name}`" :value="name" :checked="selectedFilters.codename.includes(name)"
                                @change="handleFilterChange('codename', name)">
                                <label :for="`codename-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Generation</p>
                        <button type="button" class="toggle-btn" @click="isGenFilterVisible = !isGenFilterVisible">
                            {{ isGenFilterVisible ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isGenFilterVisible" class="option-box">
                            <div class="input-option" v-for="name in filters.generation" :key="name">
                                <input type="checkbox" :id="`gen-${name}`" :value="name" :checked="selectedFilters.generation.includes(name)"
                                @change="handleFilterChange('generation', name)">
                                <label :for="`gen-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Socket</p>
                        <button type="button" class="toggle-btn" @click="isSocketFilterAvailable = !isSocketFilterAvailable">
                            {{ isSocketFilterAvailable ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isSocketFilterAvailable" class="option-box">
                            <div class="input-option" v-for="name in filters.socket" :key="name">
                                <input type="checkbox" :id="`socket-${name}`" :value="name" :checked="selectedFilters.socket.includes(name)"
                                @change="handleFilterChange('socket', name)">
                                <label :for="`socket-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Memory Support</p>
                        <button type="button" class="toggle-btn" @click="isMemSupportFilterVisible = !isMemSupportFilterVisible">
                            {{ isMemSupportFilterVisible ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isMemSupportFilterVisible" class="option-box">
                            <div class="input-option" v-for="name in filters.memorySupport" :key="name">
                                <input type="checkbox" :id="`memSupport-${name}`" :value="name" :checked="selectedFilters.memorySupport.includes(name)"
                                @change="handleFilterChange('memorySupport', name)">
                                <label :for="`memSupport-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Core Amount</p>
                        <button type="button" class="toggle-btn" @click="isCoreFilterVisible = !isCoreFilterVisible">
                            {{ isCoreFilterVisible ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isCoreFilterVisible" class="option-box">
                            <div class="input-option" v-for="name in filters.coreNum" :key="name">
                                <input type="checkbox" :id="`cores-${name}`" :value="name" :checked="selectedFilters.coreNum.includes(name)"
                                @change="handleFilterChange('coreNum', name)">
                                <label :for="`cores-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">Memory Speeds</p>
                        <button type="button" class="toggle-btn" @click="isRatedSpeedsFilterVisible = !isRatedSpeedsFilterVisible">
                            {{ isRatedSpeedsFilterVisible ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isRatedSpeedsFilterVisible" class="option-box">
                            <div class="input-option" v-for="name in filters.ratedSpeeds" :key="name">
                                <input type="checkbox" :id="`speed-${name}`" :value="name" :checked="selectedFilters.ratedSpeeds.includes(name)"
                                @change="handleFilterChange('ratedSpeeds', name)">
                                <label :for="`speed-${name}`" class="ml-2">{{ name }}MT/s</label>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div class="mb-4 brand-box">
                    <div class="filter-header">
                        <p class="fw-bold filter-tl">L3 Cache</p>
                        <button type="button" class="toggle-btn" @click="isCacheFilterAvailable = !isCacheFilterAvailable">
                            {{ isCacheFilterAvailable ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <Transition name="slide-fade">
                        <div v-if="isCacheFilterAvailable" class="option-box">
                            <div class="input-option" v-for="name in filters.cache" :key="name">
                                <input type="checkbox" :id="`cache-${name}`" :value="name" :checked="selectedFilters.cache.includes(name)"
                                @change="handleFilterChange('cache', name)">
                                <label :for="`cache-${name}`" class="ml-2">{{ name }}</label>
                            </div>
                        </div>
                    </Transition>
                </div>

            </div>
        </div>
    </div>
</template>