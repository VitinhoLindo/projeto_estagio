<template>
  <div class="home">
    <app-add @add-click="click" />

    <rent-information 
      v-if="detailData" 
      :component="component" 
      :data="detailData" 
      @close="closeDetail" 
      @updated="updateData"
      @deleted="deletedData"
    />

    <create-rent
      v-if="createMark" 
      @created-item="created" 
      @cancel="cancel" 
    />

    <div class="content">
      <div class="line-content" v-for="(line, indexc) in pageLists" v-bind:key="indexc">
        <div class="column-content" 
          v-for="(column, indexl) in line" 
          v-bind:key="indexl" 
          v-on:click="event => dataClick(event, column, { y: indexc, x: indexl })"
        >
          <div class="fields">
            <div class="label">
              Colaborador:
            </div>
            <div class="value">
              {{ getCollaborator(column.colaborador) }}
            </div>
          </div>

          <div class="fields">
            <div class="label">
              Iten:
            </div>
            <div class="value">
              {{ getIten(column.iten) }}
            </div>
          </div>

          <div class="fields">
            <div class="label">
              Criado:
            </div>
            <div class="value">
              {{ (new Date(column.created_at)).toLocaleString() }}
            </div>
          </div>

          <div class="fields">
            <div class="label">
              Alugado até:
            </div>
            <div class="value">
              {{ (new Date(column.expiration_at)).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Itens',
  async mounted() {
    /**
     * @param mounted
     *
     * func: $app.on('resize', callback: (err: String, pid: Number)) void
     *   <summary>
     *     listen resize page to change page content
     *   </summary>
     *
     * func: this.getdata() [Promise] void
     *   <summary>
     *      call to server in route ['/rent', '/collaborators', '/itens']
     *      after response set data in content page
     *   </summary>
     */
    this.$app.on('resize', this.handlePage, (err, pid) => {
      if (err) return this.$app.emit('error', { message: err, show: true });
      this.rentPid = pid;
    });
    await this.getData();
  },
  data() {
    return {
      rentPid: null,
      component: 'itens',
      detailData: null,
      detailOffset: { x: 0, y: 0 },
      createMark: false,
      data: [],
      pageLists: [],
      collaborators: [],
      itens: []
    }
  },
  methods: {
    /**
     * @param {*} id
     *
     * <summary>
     *    get name of collaborator using id
     * </summary>
     * 
     * return String;
     */
    getCollaborator(id) {
      let value = this.collaborators.filter((a) => a.id == id);
      return value[0].nome;
    },
    /**
     * @param {*} id
     *
     * <summary>
     *    get name of iten using id
     * </summary>
     *
     * return String;
     */
    getIten(id) {
      let value = this.itens.filter((a) => a.id == id);
      return value[0].nome;
    },
    /**
     * @param {*} count try five attempts to receive data
     * @param {*} error message error to emit error modal
     *
     * <summary>
     *    get data in request call to server
     * </summary>
     * return void;
     */
    async getData(count = 0, error = '') {
      if (count == 5) {
        this.$app.emit('loading', { on: false });
        return this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: true });
      try {
        let [rents, collaborators, itens] = await Promise.all([
          await this.$app.request({
            url: '/rent',
            method: 'GET',
            encrypt: true
          }),
          await this.$app.request({
            url: '/collaborators',
            method: 'GET',
            encrypt: true
          }),
          await this.$app.request({
            url: '/itens',
            method: 'GET',
            encrypt: true
          })
        ]);

        if (rents.status == 'error') throw rents.message;
        if (collaborators.status == 'error') throw collaborators.message;
        if (itens.status == 'error') throw itens.message;

        this.collaborators = collaborators.result;
        this.itens         = itens.result;
        this.data          = rents.result;
      } catch (err) {
        return this.getData(count++, err);
      }

      this.handlePage();
    },
    /**
     * <summary>
     *   create matrix of array
     *   
     *   define total data per row
     * </summary>
     * 
     * return void;
     */
    handlePage() {
      this.pageLists = [];
      let { innerWidth, innerHeight } = this.$app.getOffSet();

      let dataInLine = Math.floor(innerWidth / 360), count = 0;
      let linesData = [];

      for(let y = 0; ; y++) {
        let lineData = []
        for(let x = 0; x < dataInLine; x++) {
          let originalX = count + x;

          if (this.data[originalX]) {
            let data = this.data[originalX];
            data.originalX = originalX;
            lineData.push(data);
          }
        }
        count += dataInLine;
 
        linesData.push(lineData);
        if (count >= this.data.length) break;
      }

      this.pageLists = linesData;
      this.$app.emit('loading', { on: false });
    },
    /**
     * @param {*} event  MouseEvent
     * @param {*} line   {any}
     * @param {*} offset { x: Number, y: Number }
     *
     * <summary>
     *    show to detail modal
     * </summary>
     *
     * return void;
     */
    dataClick(event, line, offset) {
      this.detailData = line;
      this.detailOffset = offset;
    },
    /**
     * <summary>
     *    close detail modal
     * </summary>
     *
     * return void;
     */
    closeDetail() {
      this.detailData = null;
      this.detailOffset = { x: 0, y: 0 };
    },
    /**
     * @param {*} event    MouseEvent
     * @param {*} resource {any}
     *
     * <summary>
     *    change last data to new data
     *    call close detail modal
     *    call to change content page
     * </summary>
     *
     * return void;
     */
    async updateData(event, resource) {
      this.data[this.detailData.originalX] = resource;
      this.closeDetail();
      this.handlePage();
    },
    /**
     * <summary>
     *    remove last data
     *    call close detail modal
     *    call to change content page
     * </summary>
     *
     * return void;
     */
    deletedData() {
      this.data.splice(this.detailData.originalX, 1);
      this.closeDetail();
      this.handlePage();
    },
    /**
     * @param {*} event    MouseEvent
     * @param {*} resource {any}
     *
     * <summary>
     *    change last data to new data
     *    call close detail modal
     *    call to change content page
     * </summary>
     *
     * return void;
     */
    created(event, resource) {
      this.data.push(resource);
      this.createMark = false;
      this.handlePage();
    },
    /**
     * @param {*} event    MouseEvent
     *
     * <summary>
     *   set flag to show create modal
     * </summary>
     *
     * return void;
     */
    click(event) {
      this.createMark = true;
    },
    /**
     * @param {*} event    MouseEvent
     *
     * <summary>
     *   set flag to close create modal
     * </summary>
     *
     * return void;
     */
    cancel(event) {
      this.createMark = false;
    }
  },
  unmounted() {
    /**
     * @param unmounted
     * 
     * <summary>
     *    ao remover o component o metodo unmounted do vue é acionado
     *    quando for acionado remove o listiner atravez do pid do listiner
     * </summary>
    */
    this.$app.removeListiner('resize', this.rentPid);
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: rgba($color: #34495e, $alpha: 1);
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 100%;
    overflow-y: auto;
    height: 80%;

    .line-content {
      width: 100%;
      height: 170px;
      display: flex;
      flex-direction: row;
      justify-content: center;

      .column-content {
        color: #ffffff;
        cursor: pointer;
        width: 350px;
        height: 160px;
        margin: 10px 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba($color: #34495e, $alpha: 1.0);

        .fields {
          width: 100%;
          display: flex;
          flex-direction: row;

          .label {
            text-align: right;
            width: calc(30% - 10px);
            margin: 0px 5px;
          }

          .value {
            text-align: left;
            width: 70%;
          }
        }
      }

      .column-content:hover {
        background-color: rgba($color: #2c3e50, $alpha: 1);
      }
    }
  }
}
</style>