<script setup>
import SearchBar from './SearchBar.vue';
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container-fluid px-5 justify-content-between">
            <RouterLink class="navbar-brand home-img" to="/"><img src="../assets/images/EHDB-logo.png" alt="EHDB"></RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse gap-5 justify-content-center align-content-center" id="navbarNavDropdown">
                <ul class="navbar-nav gap-5">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Home</RouterLink>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Processors</a>

                        <ul class="dropdown-menu">
                            <li><RouterLink to="/cpus">All Processors</RouterLink></li>
                            <li><RouterLink to="/cpus/amd">AMD Processors</RouterLink></li>
                            <li><RouterLink to="/cpus/intel">Intel Processors</RouterLink></li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Servers</a>

                        <ul class="dropdown-menu">
                            <li><RouterLink to="/servers">All Servers</RouterLink></li>
                            <li><RouterLink to="/servers/dell">Dell</RouterLink></li>
                            <li><RouterLink to="/servers/hpe">HPE</RouterLink></li>
                            <li><RouterLink to="/servers/supermicro">Supermicro</RouterLink></li>
                            <li><RouterLink to="/servers/gigabyte">Gigabyte</RouterLink></li>
                            <li><RouterLink to="/servers/asus">Asus</RouterLink></li>
                            <li><RouterLink to="/servers/cloud-ninjas">Cloud Ninjas</RouterLink></li>
                            <!-- More to add -->
                        </ul>
                    </li>

                    <!-- More hardware parts to add -->

                    <li class="nav-item align-self-center">
                        <RouterLink to="/about">About</RouterLink>
                    </li>
                </ul>

                <SearchBar />
            </div>
        </div>
    </nav>
</template>

<style scoped>
    .home-img{
        max-width: 5rem;
    }

    .dropdown-menu > li{
        padding: 5px;
    }
</style>