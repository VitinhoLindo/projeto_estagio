<template>
  <div class="information" v-if="processedData">
    <div class="detail">
      <div class="fields">

        <div class="field">
          <div class="label">{{ language.labels['label-name'] }}</div>
          <div class="value" v-if="!processed.nome.update" v-on:click="updateData('nome')">{{ processed.nome.value }}</div>
          <div class="value" v-else v-on:input="changeData('nome')" v-on:mouseleave="changeData('nome')"><input type="text" v-model="processed.nome.modified"></div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['field-model'] }}</div>
          <div class="value" v-if="!processed.modelo.update" v-on:click="updateData('modelo')">{{ processed.modelo.value }}</div>
          <div class="value" v-else v-on:input="changeData('modelo')" v-on:mouseleave="changeData('modelo')"><input type="text" v-model="processed.modelo.modified"></div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['field-mark'] }}</div>
          <div class="value" v-if="!processed.marca.update" v-on:click="updateData('marca')">{{ marca }}</div>
          <div class="value" v-else v-on:input="changeData('marca')" v-on:mouseleave="changeData('marca')">
            <select v-model="processed.marca.modified">
              <option v-for="(mark, index) in marks" v-bind:value="mark.id" v-bind:key="index">{{ mark.nome }}</option>
            </select>
          </div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['label-created'] }}</div>
          <div class="value">{{ getLocalDate(processed.created_at.value) }}</div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['label-updated'] }}</div>
          <div class="value">{{ getLocalDate(processed.updated_at.value) }}</div>
        </div>

      </div>

      <div class="buttons-detail">
        <div v-on:click="deleteData">{{ language.labels['delete-data'] }}</div>
        <div v-on:click="updatedData">{{ language.labels['update-data'] }}</div>
        <div v-on:click="closeModal">{{ language.labels['cancel'] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageMixin from '../mixins/Language'

export default {
  name: 'Information',
  mixins: [LanguageMixin],
  props: ['component', 'data'],
  mounted() {
    this.processData();
  },
  data() {
    return {
      marks: [],
      processedData: false,
      processed: {}
    };
  },
  methods: {
    async onMounted() {
      this.locked = true;
      this.$app.emit('loading', { on: true });

      try {
        let { status, code, result, message } = await this.$app.request({
          url: '/mark',
          method: 'get',
          encrypt: true
        });

        if (status == 'error') throw message;

        this.marks = result;
      } catch(error) {
        this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
      this.locked = false;
    },
    async processData() {
      await this.onMounted();

      for(let key in this.data) {
        this.processed[key] = {
          value: this.data[key],
          modified: this.data[key],
          update: false
        };
      }

      this.processedData = true;
    },
    updateData(key) {
      this.processed[key].update = true;
    },
    async updatedData(event) {
      this.$app.emit('loading', { on: true });

      try {
        let updated = {};

        for(let key in this.processed) {
          if (key == 'id') {
            updated[key] = this.processed[key].value;
          }
          if (this.processed[key].value != this.data[key]) {
            updated[key] = this.processed[key].value;
          }
        }

        let { code, message, result, status } = await this.$app.request({
          url: '/itens',
          method: 'put',
          data: updated,
          encrypt: true
        });

        if (status == 'error') throw message;
        return this.$emit('updated', event, result);
      } catch(error) {
        this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
    },
    async deleteData() {
      this.$app.emit('loading', { on: true });

      try {
        let { code, message, result, status } = await this.$app.request({
          url: '/itens',
          method: 'delete',
          params: { id: this.data.id },
          encrypt: true
        });

        if (status == 'error') throw message;

        return this.$emit('deleted');
      } catch (error) {
        this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
    },
    cancelUpdate() {
      for(let key in this.processed) {
        this.processed[key].update = false;
      }
    },
    async changeData(key) {
      const lastLen = this.processed[key].modified.length;

      await this.$app.sleep(2);

      const newLen = this.processed[key].modified.length;

      if (newLen == lastLen) {
        this.processed[key].value = this.processed[key].modified;
        this.processed[key].update = false;
      }
    },
    getLocalDate(dateString) {
      let date = new Date(dateString);

      if (date == 'Invalid Date') return '...';

      return date.toLocaleString();
    },
    closeModal() {
      this.$emit('close');
    }
  },
  computed: {
    marca() {
      let marca = this.marks.filter((a) => a.id == this.processed.marca.value)[0];
      return marca.nome;
    }
  }
}
</script>

<style lang="scss" scoped>
.information {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 4;
  background-color: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.information .detail {
  padding: 1% 1.5%;
  max-width: 90%;
  max-height: 95%;
  position: absolute;
  z-index: 5;
  background-color: rgba($color: #ffffff, $alpha: 1.0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.information .detail .fields {
  margin: 5%;
  min-width: 70%;
  height: 90%;
}

.information .detail .fields .field {
  display: flex;
  flex-direction: row;
  margin: 10px auto;
}

.information .detail .fields .field:nth-child(-n+3)>.value {
  cursor: pointer;
  color: rgba($color: #3498db, $alpha: 1.0)
}



.information .detail .fields .field div {
  padding: 5px;
}

.information .detail .fields .field .label {
  min-width: 100px;
  text-align: right;
}

.information .detail .fields .field .value {
  min-width: 140px;
  text-align: left;
}

.information .detail .buttons-detail {
  width: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}


.information .detail .buttons-detail div {
  -webkit-border-radius: 5px;
  cursor:pointer;
  margin: 5px 5px;
  min-width: 70px;
  max-width: 33.3%;
  padding: 9px;
  height: calc(90% - 10px);
  text-align: center;
  color: #ffffff;
}

.information .detail .buttons-detail div:hover {
  opacity: 0.6;
}

.information .detail .buttons-detail div:nth-child(1) {
  background-color: rgba($color: #e74c3c, $alpha: 1.0);
}

.information .detail .buttons-detail div:nth-child(2) {
  background-color: rgba($color:#3498db, $alpha: 1.0);
}

.information .detail .buttons-detail div:nth-child(3) {
  background-color: rgba($color:#95a5a6, $alpha: 1.0);
}


@media only screen and (max-width: 768px) {
  .information .detail {
    width: 60%;
    min-width: 350px;
  }
  .information .detail .buttons-detail {
    flex-direction: row;
  }

  .information .detail .fields {
    min-width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .information .detail .fields .field {
    flex-direction: row;
  }

  .information .detail .fields .field .label {
    text-align: center;
  }

  .information .detail .fields .field .value {
    text-align: center;
  }
}
</style>