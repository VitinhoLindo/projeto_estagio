export default {
  mounted () {
    this.languageChanged();
    this.languageListen();
  },
  data () {
    return {
      langPid: 0,
      languageListinerName: 'language-changed',
      language: {
        lang: '',
        labels: {}
      }
    }
  },
  methods: {
    /**
     * @param ouvinte
     * 
     * verifica mudança na linguagem do app
     */
    async languageListen() {
      this.$app.on(this.languageListinerName, this.languageChanged, (err, pid) => {
        if (err) return console.error(err);
        this.langPid = pid;
      });
    },
    /**
     * @param languageChanged
     * 
     * muda os labels do component para a nova linguagem selecionada
     */
    languageChanged() { 
      /**
       * obtem o novo lang
       */
      this.language = this.$app.$lang();
    }
  },
  unmounted() {
    /**
     * @param unmounted
     * 
     * ao remover o component o metodo unmounted do vue é acionado
     * quando for acionado remove o listiner atravez do pid do listiner
    */
    this.$app.removeListiner(this.languageListinerName, this.langPid);
  }
}