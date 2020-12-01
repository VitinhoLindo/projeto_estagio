<template>
  <div class="information" v-if="processedData">
    <div class="detail">
      <div class="info">
        <label>{{ language.labels['create-rent-label'] }}</label>
      </div>

      <div class="fields">

        <div class="field">
          <div class="label">{{ language.labels['field-collaborator'] }}</div>
          <div class="value" v-if="!processed.colaborador.update">
            {{ filterValues('collaborators', processed.colaborador.value) }}
          </div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['field-iten'] }}</div>
          <div class="value" v-if="!processed.iten.update">
            {{ filterValues('itens', processed.iten.value) }}
          </div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['field-expiration'] }}</div>
          <div class="value" v-if="!values.date.update" v-on:click="updateData('date')">
            {{ values.date.value }}
          </div>
          <div class="value" v-else @mouseleave="cancelUpdate">
            <input type="date" v-model="values.date.value" v-on:change="changeData('date')">
          </div>
        </div>

        <div class="field">
          <div class="label">{{ language.labels['field-hour'] }}</div>
          <div class="value" v-if="!values.time.update" v-on:click="updateData('time')">
            {{ values.time.value }}
          </div>
          <div class="value" v-else @mouseleave="cancelUpdate">
            <input type="time" v-model="values.time.value" v-on:change="changeData('time')">
          </div>
        </div>
      </div>

      <div class="buttons-detail">
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
      values: {
        collaborators: [],
        itens: [],
        date: { value: '', update: false},
        time: { value: '', update: false}
      },
      processedData: false,
      processed: {}
    };
  },
  methods: {
    filterValues(type, value) {
      value = this.values[type].filter((a) => a.id == value);
      return value[0].nome;
    },
    async onMounted(count = 0, error = '') {
      if (count == 5) {
        this.$app.emit('loading', { on: false });
        return this.$app.emit('error', { message: error, show: true });
      }

      this.locked = true;
      this.$app.emit('loading', { on: true });

      try {
        let [itens, collaborators] = await Promise.all([
          await this.$app.request({
            url: '/itens',
            method: 'get',
            encrypt: true
          }),
          await this.$app.request({
            url: '/collaborators',
            method: 'get',
            encrypt: true
          })
        ]);

        if (itens.status == 'error') throw itens.message;
        if (collaborators.status == 'error') throw collaborators.message;

        this.values.collaborators = collaborators.result;
        this.values.itens = itens.result;
      } catch(error) {
        return this.onMounted(count++, error);
      }

      this.locked = false;
    },
    getObjectDate(date = new Date()) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds()
      }
    },
    setDate(date = new Date()) {
      let object = this.getObjectDate(date);
      this.values.date.value = `${object.year}-${(`0${object.month}`).slice(-2)}-${object.day}`;
    },
    setTime(date = new Date()) {
      let object = this.getObjectDate(date);
      this.values.time.value = `${(`0${object.hours}`).slice(-2)}:${(`0${object.minutes}`).slice(-2)}`;
    },
    async processData() {
      await this.onMounted();

      let date = new Date(this.data.expiration_at);
      this.setDate(date);
      this.setTime(date);

      for(let key in this.data) {
        this.processed[key] = {
          value: this.data[key],
          modified: this.data[key],
          update: false
        };
      }

      this.processedData = true;
      this.$app.emit('loading', { on: false });
    },
    updateData(key) {
      this.values[key].update = true;
    },
    cancelUpdate(event) {
      for(let key in this.values) {
        this.values[key].update = false;
      }
    },
    async changeData(key) {
      this.values[key].update = false;
    },
    async updatedData(event) {
      this.$app.emit('loading', { on: true });

      try {
        let updated = { id: this.data.id };
        updated.expiration_at = new Date(`${this.values.date.value} ${this.values.time.value}`);

        let { code, message, result, status } = await this.$app.request({
          url: '/rent',
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
  -webkit-border-radius: 5px;
}

.information .detail .info {
  height: 50px;
  border-bottom: 1px solid #cccccc;
}

.information .detail .info label {
  width: 100%;
  height: 20px;
  padding: 0%;
  font-size: 1.17em;
  color: #cccccc;
}

.information .detail .fields {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.information .detail .fields .field {
  -webkit-border-radius: 5px;
  width: calc(100% - 20px);
  padding: 10px 10px;
  margin: 5px auto;
  display: flex;
  flex-direction: row;
  border: 1px solid #cccccc;
}

.information .detail .fields .field div {
}

.information .detail .fields .field .label {
  width: 30%;
  text-align: right;
}

.information .detail .fields .field .value {
  width: calc(70% - 20px);
  padding: 0px 10px;
  text-align: center;
}

.information .detail .fields .field:nth-child(-n+4)>.value {
  color: rgba($color: #3498db, $alpha: 1.0)
}

.information .detail .fields .field:nth-child(+n+3)>.value {
  cursor: pointer;
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
    width: 90%;
    padding: 10px;
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