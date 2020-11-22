<template>
  <div class="marks">
    <app-add @add-click="click" />

    <information-component 
      v-if="detailData" 
      :component="component" 
      :data="detailData" 
      @close="closeDetail" 
      @updated="updateData"
      @deleted="deletedData"
    />

    <create-mark 
      v-if="createMark" 
      @created-mark="created" 
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
              Nome:
            </div>
            <div class="value">
              {{ column.nome }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mark',
  async mounted() {
    await this.getData();
  },
  data() {
    return {
      component: 'mark',
      detailData: null,
      detailOffset: { x: 0, y: 0 },
      createMark: false,
      data: [],
      pageLists: []
    }
  },
  methods: {
    async getData() {
      this.$app.emit('loading', { on: true });

      let { code, message, result, status } = await this.$app.request({
        url: '/mark',
        method: 'GET',
        encrypt: true
      });

      this.data = result;
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

      let dataInLine = Math.floor(innerWidth / 260), count = 0;
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
.marks {
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
      height: 140px;
      display: flex;
      flex-direction: row;
      justify-content: center;

      .column-content {
        color: #ffffff;
        cursor: pointer;
        width: 250px;
        height: 120px;
        margin: 10px 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba($color: #34495e, $alpha: 1.0);

        .fields {
          display: flex;
          flex-direction: row;

          .label {
            text-align: center;
            width: 30%;
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