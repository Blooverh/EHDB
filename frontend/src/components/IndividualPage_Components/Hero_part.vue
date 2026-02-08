<script setup>

    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const props = defineProps({
        part:{
            type: Object,
            required: true
        }, 
        type: { // ensuring only valid parts are passed, ensuring bug prevention
            type: String, 
            required: true, 
            validator: (value) => ['cpu', 'server'].includes(value)
        }
    });

    // breadcrumb
    // Computed property 
    const breadcrumbs = computed(() => {
        const paths = route.path.split('/').filter(Boolean); // Boolean is used to remove empty strings

        // we map each path element in paths, and build a fullpath, and assign to that map key label with value 
        // and path key with value of the path
        return paths.map((path, index) => {
            const fullPath = '/' + paths.slice(0, index + 1).join('/');

            return {
                label: path.charAt(0).toUpperCase() + path.slice(1),
                path: fullPath
            };
        });

    });

    /* Computed display values based on type */

</script>