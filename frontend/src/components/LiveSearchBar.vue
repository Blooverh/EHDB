<script setup>
  /* 
    WILL NEED TO ADD OTHER PARTS WHEN AVAILABLE ON DATABASE
  */
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { cpuBrandFormatter, formatModel } from '../utils/formatCpuTitle.js';

  // Reactive state variables for the search component
  const searchTerm = ref(''); // Stores the current input value from the search bar
  const searchResults = ref({ cpus: [], servers: [] }); // Stores the fetched search results for CPUs and Servers
  const isLoading = ref(false); // Indicates if an API call is currently in progress
  const showResults = ref(false); // Controls the visibility of the search results dropdown
  const highlightedIndex = ref(-1); // Tracks the currently highlighted item for keyboard navigation
  const router = useRouter(); // Vue Router instance for programmatic navigation
  const searchContainer = ref(null); // Template ref to the search container for click-outside detection

  let debounceTimer = null; // Used to hold the timer ID for debouncing search requests

  // Creates a single, flattened array of all search results for easy keyboard navigation.
  const flatResults = computed(() => {
    const cpus = (searchResults.value.cpus || []).map(item => ({ type: 'cpu', item }));
    const servers = (searchResults.value.servers || []).map(item => ({ type: 'server', item }));
    return [...cpus, ...servers];
  });

  /**
   * Performs the actual search API call based on the provided term.
   * @param {string} term The search query entered by the user.
   */
  const performSearch = async (term) => {
    // If the search term is too short, clear results and hide the dropdown
    if (term.length < 2) {
      searchResults.value = { cpus: [], servers: [] };
      showResults.value = false;
      return;
    }

    isLoading.value = true; // Set loading state to true while fetching
    try {
      // Make an API request to the backend search endpoint
      const response = await axios.get(`/api/search?q=${term}`);
      const { cpus, servers } = response.data;

      // "CPU-first" logic: If any CPUs are found, we only show those.
      // Otherwise, show servers if they exist.
      if (cpus && cpus.length > 0) {
        searchResults.value = { cpus, servers: [] }; // Clear server results
      } else {
        searchResults.value = { cpus: [], servers };
      }
      
      showResults.value = true; // Show the results dropdown
    } catch (error) {
      console.error('Error fetching search results:', error);
      // On error, clear results and hide dropdown
      searchResults.value = { cpus: [], servers: [] };
      showResults.value = false;
    } finally {
      isLoading.value = false; // Always reset loading state
    }
  };

  /**
   * Handles input events from the search bar.
   * Implements debouncing to limit API calls.
   */
  const onInput = () => {
    highlightedIndex.value = -1; // Reset highlight when input changes
    // Clear any existing debounce timer to reset the countdown
    clearTimeout(debounceTimer);
    // Set a new timer to call performSearch after 300ms of inactivity
    debounceTimer = setTimeout(() => {
      performSearch(searchTerm.value);
    }, 300); // 300ms debounce delay
  };

  // Handles keyboard navigation for the search results dropdown.
  const onKeydown = (e) => {
    if (!showResults.value || flatResults.value.length === 0) return; // Only navigate if results are visible and exist

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Prevent cursor movement in input
        if (highlightedIndex.value < flatResults.value.length - 1) {
          highlightedIndex.value++;
        } else {
          highlightedIndex.value = 0; // Loop to first item
        }
        break;
      case 'ArrowUp':
        e.preventDefault(); // Prevent cursor movement in input
        if (highlightedIndex.value > 0) {
          highlightedIndex.value--;
        } else {
          highlightedIndex.value = flatResults.value.length - 1; // Loop to last item
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex.value !== -1) {
          const result = flatResults.value[highlightedIndex.value];
          navigateToResult(result.item, result.type);
        }
        break;
      case 'Escape': // Optional: close dropdown on Escape
        closeResults();
        break;
    }
  };


  /**
   * Navigates to the individual detail page of a selected search result.
   * @param {object} item The selected CPU or Server object.
   * @param {string} type The type of item ('cpu' or 'server').
   * Router.push() finds on router file the path and attaches each paramater to the parameter assigned in the router file for the name of that route 
   * If route has name: 'Indivdual CPU' and path: '/cpus/:brand/:slug'
   * it constructs the route and pushes that route to router to redirect to new page 
   */
  const navigateToResult = (item, type) => {
    if (type === 'cpu') {
      // Navigate to individual CPU page using named route and parameters
      router.push({ name: 'Individual CPU', params: { brand: item.brand, slug: item.slug } });
    } else if (type === 'server') {
      // Navigate to individual Server page using named route and parameters
      router.push({ name: 'Individual Server', params: { brand: item.brand, slug: item.slug } });
    }
    closeResults(); // Hide the results dropdown after navigation
  };

  /**
   * Closes (hides) the search results dropdown.
   */
  const closeResults = () => {
    showResults.value = false;
    highlightedIndex.value = -1; // Reset highlight when closing results
  };

  /**
   * Event handler for clicks outside the search container.
   * Closes the search results if the click occurred outside.
   * @param {Event} event The DOM click event.
   */
  const handleClickOutside = (event) => {
    // Check if the click target is outside the search container element
    if (searchContainer.value && !searchContainer.value.contains(event.target)) {
      closeResults(); // Close results if clicked outside
    }
  };

  // Lifecycle hook: runs after the component is mounted to the DOM
  onMounted(() => {
    // Add a global click event listener to detect clicks outside the search component
    document.addEventListener('click', handleClickOutside);
  });

  // Lifecycle hook: runs before the component is unmounted from the DOM
  onBeforeUnmount(() => {
    // Remove the global click event listener to prevent memory leaks
    document.removeEventListener('click', handleClickOutside);
  });

  /**
   * Computed property to determine if there are any search results to display.
   * Returns true if either CPUs or Servers array has elements.
   */
  const hasResults = computed(() => {
    return (searchResults.value.cpus && searchResults.value.cpus.length > 0) || (searchResults.value.servers && searchResults.value.servers.length > 0);
  });
</script>


<template>
  <div class="search-container" ref="searchContainer">
    <div class="search-box">
      <input
        type="text"
        class="search-input"
        placeholder="Search for servers, processors, SSDs etc..."
        v-model="searchTerm"
        @input="onInput"
        @keydown="onKeydown"
      />
      <!-- The search button is kept for consistency but the primary search is live -->
      <button type="button" class="search-btn">Search</button>
    </div>
    <!-- Search Results Dropdown -->
    <div v-if="showResults" class="search-results">
      <div v-if="isLoading" class="loading-item">Loading...</div>
      <div v-else-if="hasResults">
        <!-- Display CPU results if any -->
        <div v-if="searchResults.cpus && searchResults.cpus.length">
          <div class="results-header d-flex flex-row justify-content-between align-items-center">
            <h4 class="header-part">CPUs</h4>
            <RouterLink :to="`/cpus`">Browse All</RouterLink>
          </div>
          <ul>
            <!-- @click will trigger function navigateToResult that will construct the route for redirection when option is selected -->
            <li
              v-for="(cpu, index) in searchResults.cpus"
              :key="cpu._id"
              :class="{ 'highlighted': highlightedIndex === index }"
              @click="navigateToResult(cpu, 'cpu')"
            >
              {{ cpuBrandFormatter(cpu.brand) }} {{ formatModel(cpu.model) }}
            </li>
          </ul>
        </div>
        <!-- Display Server results if any -->
        <div v-if="searchResults.servers && searchResults.servers.length">
          <div class="results-header d-flex flex-row justify-content-between align-items-center">
            <h4 class="header-part">Servers</h4>
            <RouterLink :to="`/servers`">Browse All</RouterLink>
          </div>
          <ul>
            <li
              v-for="(server, index) in searchResults.servers"
              :key="server._id"
              :class="{ 'highlighted': highlightedIndex === (searchResults.cpus.length + index) }"
              @click="navigateToResult(server, 'server')"
            >
              {{ server.brand }} {{ server.model }}
            </li>
          </ul>
        </div>
      </div>
      <!-- Message when no results are found -->
      <div v-else class="no-results">
        No results found for "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Scoped styles for the LiveSearchBar component */

.search-container {
  position: relative; /* Needed for positioning the search results dropdown */
  width: 500px; /* Fixed width for the search bar */
}

.search-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    padding: 5px 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow for depth */
}

.search-input {
  border: none; /* Remove default input border */
  outline: none; /* Remove outline on focus */
  flex-grow: 1; /* Allows input to take available space */
  padding: 10px;
  background-color: transparent;
}

.search-btn {
    background-color: #007bff; /* Primary blue color */
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
}

.search-results {
  position: absolute; /* Positions the dropdown relative to .search-container */
  top: 100%; /* Places the dropdown right below the search box */
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none; /* No top border as it connects to the search box */
  max-height: 400px; /* Limits the height of the dropdown */
  overflow-y: auto; /* Adds scrollbar if results exceed max-height */
  z-index: 1000; /* Ensures the dropdown appears above other content */
  border-radius: 0 0 8px 8px; /* Rounded corners only at the bottom */
  margin-top: 10px; /* Small gap between search box and results */
  border-radius: 8px;
}

.results-header {
    padding: 8px 12px;
    background-color: #f8f9fa; /* Light background for headers */
    font-weight: bold;
    color: #007bff; /* Primary blue color for header text */
    border-bottom: 1px solid #eee;
    margin: 0;
}

.header-part {
  font-weight: bold;
}

ul {
  list-style: none; /* Remove default list bullets */
  margin: 0;
  padding: 0;
}

li {
  padding: 10px 15px;
  cursor: pointer; /* Indicates item is clickable */
}

li:hover {
  background-color: #f0f0f0; /* Light highlight on hover */
}

.loading-item, .no-results {
    padding: 10px 15px;
    color: #666; /* Muted text color */
}

.highlighted {
  background-color: #f0f0f0; /* Use a similar highlight to the hover state */
}
</style>