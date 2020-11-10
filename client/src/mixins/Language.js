export default {
  mounted () {
    this.listen();
  },
  data () {
    return {
      pid: 0,
    }
  },
  methods: {
    async listen() {
      this.$app.on('language-changed', this.destroyed, (err, pid) => {
        if (err) return console.error(err);
        this.pid = pid;
      });
    },
  },
  destroyed() {
    
  }
}