<script setup>
</script>

<template>

    <div class="footer-bg">
        <div class="top-footer justify-content-center gap-3">
            <div class="ehdb-box">
                <div class="ehdb-logo">

                </div>
                <p class="sm-description">EHDB is a comprehensive database of enterprise 
                    hardware systems and components, such as, servers, CPUs, GPUs, Storage etc...
                    <br>
                    Whether you're an IT professional or a fan of computer hardware I hope I can 
                    help you show the specifications of each component or system. Thank you!
                </p>

                <span class="created-by">
                    Created By: <strong>Diogo Aires </strong>
                </span>
            </div>

            <div class="quick-links d-flex flex-column">
                <p class="subtl"><strong>Quick Links</strong></p>
                <span class="link"><a href="">Browse Hardware</a></span>
                <span class="link"><a href="">About EHDB</a></span>
            </div>

            <div class="social-box">
                <p class="subtl"><strong>Connect</strong></p>
                <span class="contact-email"><a href="mailto:">contact@ehdb.com</a></span>
                <div class="social-svgs">

                </div>
            </div>
        </div>

        <div class="solid"></div>

        <div class="sub-footer d-flex justify-content-center">
            <span>© 2025 EHDB - Enterprise Hardware Database. All rights reserved.</span>
        </div>
    </div>
</template>

<style scoped>

    p, span {
        color: gray;
    }

    .subtl {
        color: black;
    }

    .created-by > strong {
        color:black;
    }

    .footer-bg {
        background-color: #d1d1d134;
        padding: 20px;

    }

    .top-footer {
        display: grid;
        grid-template-columns: 300px 300px 300px;
        justify-items: anchor-center;
    }

    .solid {
        border: solid gray 1px;
        margin: 20px;
    }

    

</style>