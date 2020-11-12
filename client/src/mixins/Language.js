export default {
  mounted () {
    this.languageChanged();
    this.listen();
  },
  data () {
    return {
      pid: 0,
      listinerName: 'language-changed'
    }
  },
  methods: {
    /**
     * @param ouvinte
     * 
     * verifica mudança na linguagem do app
     */
    async listen() {
      this.$app.on(this.listinerName, this.languageChanged, (err, pid) => {
        if (err) return console.error(err);
        this.pid = pid;
      });
    },
    /**
     * @param languageChanged
     * 
     * muda os labels do component para a nova linguagem selecionada
     */
    languageChanged() { }
  },
  unmounted() {
    /**
     * @param unmounted
     * 
     * ao remover o component o metodo unmounted do vue é acionado
     * quando for acionado remove o listiner atravez do pid do listiner
    */
    this.$app.removeListiner(this.listinerName, this.pid);
  }
}