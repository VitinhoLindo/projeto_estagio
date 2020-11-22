export default {
  mounted () {
    this.errorListen()
  },
  data () {
    return {
      errorListenerName: 'error',
      errorPid: 0,
      errorValues: {
        show: false,
        message: []
      }
    }
  },
  methods: {
    /**
     * @param ouvinte
     * 
     * ouve as solicitações de erro
     */
    errorListen() {
      this.$app.on(this.errorListenerName, this.showError, (err, pid) => {
        if (err) throw err;
        this.errorPid = pid;
      });
    },
    /**
     * 
     * @param {message: String, show: Boolean} opt 
     */
    showError(opt = { message: '', show: false }) {
      console.log(opt);
      this.errorValues.show = opt.show;
      if (opt.message.constructor.name == 'String') {
        this.errorValues.message = [opt.message];
      } else if (opt.message.constructor.name == 'Array') {
        this.errorValues.message = opt.message;
      }
    },
    /**
     * ao confirmar fecha o modal
     */
    errorClick() {
      this.errorValues = {
        show: false,
        message: []
      };
    }
  },
  unmounted() {
    /**
     * @param unmounted
     * 
     * ao remover o component o metodo unmounted do vue é acionado
     * quando for acionado remove o listiner atravez do pid do listiner
    */
    this.$app.removeListiner(this.errorListenerName, this.errorPid);
  }
}