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
    await this.getData();
  },
  data() {
    return {
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
    getCollaborator(id) {
      let value = this.collaborators.filter((a) => a.id == id);
      return value[0].nome;
    },
    getIten(id) {
      let value = this.itens.filter((a) => a.id == id);
      return value[0].nome;
    },
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
      } catch (error) {
        return this.getData(count++, error);
      }

      this.handlePage();
    },
    dataClick(event, line, offset) {
      this.detailData = line;
      this.detailOffset = offset;
    },
    closeDetail() {
      this.detailData = null;
      this.detailOffset = { x: 0, y: 0 };
    },
    async updateData(event, resource) {
      this.data[this.detailData.originalX] = resource;
      this.closeDetail();
      this.handlePage();
    },
    deletedData() {
      this.data.splice(this.detailData.originalX, 1);
      this.closeDetail();
      this.handlePage();
    },
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
    created(event, resource) {
      this.data.push(resource);
      this.createMark = false;
      this.handlePage();
    },
    click(event) {
      this.createMark = true;
    },
    cancel(event) {
      this.createMark = false;
    }
  },
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