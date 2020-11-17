export default {
  mounted() {
    this.listen();
  },
  data () {
    return {
      listenerName: 'loading',
      pid: 0,
      loading: false
    }
  },
  methods: {
    listen() {
      this.$app.on(this.listenerName, this.show, (err, pid) => {
        if (err) throw err;
        this.pid = pid;
      });
    },
    async show(arg = { on: true, time: 0 }) {
      this.loading = arg.on;
    }
  },
  unmounted() {
    this.$app.removeListiner(this.listenerName, this.pid);
  }
}