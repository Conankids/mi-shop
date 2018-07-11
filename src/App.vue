<template>
    <div id="app">
        <NavHeader/>
        <router-view/>
        <NavFooter/>
    </div>
</template>

<script>
    import '@/assets/css/base.css'
    import NavHeader from '@/components/NavHeader'
    import NavFooter from '@/components/NavFooter'
    export default {
        name: 'App',
        components:{
            NavHeader,
            NavFooter
        }
    }
</script>