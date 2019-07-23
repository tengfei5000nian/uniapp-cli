export default {
    computed: {
        showConfig() {
            return ((this.$store.getters.config || {}).mxzb_config || {}).show || {}
        }
    }
}