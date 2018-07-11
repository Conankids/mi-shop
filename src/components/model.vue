<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':isShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <button class="md-close" @click="close">Close</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <slot name="msg"></slot>
                    </div>
                    <div class="btn-wrap">
                        <slot name="btnGroup"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="isShow" @click="close"></div>
    </div>
</template>

<script>
    export default {
        props: ['isShow'],
        data() {
            return {}
        },
        methods: {
            close() {
                this.$emit('update:isShow', false)
            }
        }
    }
</script>

<style>

</style>