<script setup>
</script>

<template>

    <div class="footer-bg">
        <div class="top-footer justify-content-center gap-3">
            <div class="ehdb-box">
                <div class="ehdb-logo d-flex flex-row gap-2 mb-2">
                    <div class="logo-box">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 9.33337C19.799 9.33337 24.5 7.76637 24.5 5.83337C24.5 3.90038 19.799 2.33337 14 2.33337C8.20101 2.33337 3.5 3.90038 3.5 5.83337C3.5 7.76637 8.20101 9.33337 14 9.33337Z" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 5.83337V22.1667C3.5 23.095 4.60625 23.9852 6.57538 24.6416C8.54451 25.298 11.2152 25.6667 14 25.6667C16.7848 25.6667 19.4555 25.298 21.4246 24.6416C23.3938 23.9852 24.5 23.095 24.5 22.1667V5.83337" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 14C3.5 14.9283 4.60625 15.8185 6.57538 16.4749C8.54451 17.1313 11.2152 17.5 14 17.5C16.7848 17.5 19.4555 17.1313 21.4246 16.4749C23.3938 15.8185 24.5 14.9283 24.5 14" stroke="#F8FAFC" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="ehdb-logo-tx d-flex flex-column">
                        <span class="logo-title">EHDB</span>
                        <span class="logo-subtitle">Enterprise Hardware Database</span>
                    </div>
                </div>
                <p class="sm-description">EHDB is a comprehensive database of enterprise 
                    hardware systems and components, such as, servers, CPUs, GPUs, Storage etc...
                    <br>
                    Whether you're an IT professional or a fan of computer hardware I hope I can 
                    help you show the specifications of each component or system. Thank you!
                </p>

                <span class="created-by">
                    Created By: <strong>Blooverh</strong>
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

    .logo-box {
        background: linear-gradient(to right, cyan, blue);
        border-radius: 8px;
        align-self: center;
        padding: 10px;
    }
    .logo-title {
        font-size: 1rem;
        color: black;
        font-weight: 700;
    }

    

</style>