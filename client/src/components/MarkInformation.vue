<template>
  <div class="information" v-if="processedData">
    <div class="detail">

      <div class="label-form">
        <label>{{ language.labels['information-mark-label'] }}</label>
      </div>

      <div class="fields">

        <div class="field" v-if="processed.nome">
          <div class="content">
            <div class="label">
              {{ language.labels['label-name'] }}
            </div>
            <div class="value" v-if="!processed.nome.update" v-on:click="updateData('nome')">
              {{ processed.nome.value }}
            </div>
            <div class="value" v-else v-on:input="changeData('nome')" v-on:mouseleave="changeData('nome')">
              <input type="text" v-model="processed.nome.modified">
            </div>
          </div>
          <div class="error" v-if="processed.nome.error">
            {{ processed.nome.error }}
          </div>
        </div>

        <div class="field" v-if="processed.created_at">
          <div class="content">
            <div class="label">
              {{ language.labels['label-created'] }}
            </div>
            <div class="value">
              {{ getLocalDate(processed.created_at.value) }}
            </div>
          </div>
        </div>

        <div class="field" v-if="processed.updated_at">
          <div class="content">
            <div class="label">
              {{ language.labels['label-updated'] }}
            </div>
            <div class="value">
              {{ getLocalDate(processed.updated_at.value) }}
            </div>
          </div>
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
      processedData: false,
      processed: {}
    };
  },
  methods: {
    processData() {
      for(let key in this.data) {
        this.processed[key] = {
          value: this.data[key],
          modified: this.data[key],
          update: false,
          error: ''
        };
      }

      this.processedData = true;
    },
    updateData(key) {
      this.processed[key].update = true;
    },
    async updatedData(event) {
      this.$app.emit('loading', { on: true });

      let req = {
        success: null,
        error: null,
        trying: 0,
        maxTrying: 5
      }

      let updated = {};

      for(let key in this.processed) {
        if (key == 'id') {
          updated[key] = this.processed[key].value;
        }
        if (this.processed[key].value != this.data[key]) {
          updated[key] = this.processed[key].value;
        }
      }

      while(req.trying < req.maxTrying) {
        try {
          let { code, message, result, status } = await this.$app.request({
            url: '/mark',
            method: 'put',
            data: updated,
            encrypt: true
          });

          if (status == 'error') {
            throw (result.error || message);
          }

          req.success = result;
          break;
        } catch(error) {
          req.error = error;
          req.trying++;
          continue;
        }
      }

      this.$app.emit('loading', { on: false });
      if (req.success) {
        return this.$emit('updated', event, req.success);
      } else {
        if (typeof req.error == 'string') return this.$emit('error', { message: req.error, show: true });
        else return this.showError(req.error);
      }
    },
    async deleteData() {
      this.$app.emit('loading', { on: true });

      try {
        let { code, message, result, status } = await this.$app.request({
          url: '/mark',
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
    /**
     *
     *
     *
     */
    cancelUpdate() {
      for(let key in this.processed) {
        this.processed[key].update = false;
      }
    },
    showError(error = {}) {
      for (let key in error) {
        if (this.processed[key])
          this.processed[key].error = error[key];
      }
    },
    async changeData(key) {
      const lastLen = this.processed[key].modified.length;

      await this.$app.sleep(1);

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
  padding: 10px;
  width: 25%;
  min-width: 400px;
  position: absolute;
  z-index: 5;
  background-color: rgba($color: #ffffff, $alpha: 1.0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.information .detail .fields {
  min-width: 70%;
  height: 90%;
}

.information .detail .label-form {
  text-align: center;
  height: 50px;
}

.information .detail .label-form label {
  width: 100%;
  height: 20px;
  font-size: 1.17em;
  color: #cccccc;
}

.information .detail .fields .field {
  -webkit-border-radius: 5px;
  border: 1px solid #cccccc;
  margin-bottom: 5px;
}

.information .detail .fields .field .content {
  display: flex;
  flex-direction: row;
}

.information .detail .fields .field .content:nth-child(1)>.value {
  cursor: pointer;
  color: rgba($color: #3498db, $alpha: 1.0)
}

.information .detail .fields .field .content div {
  padding: 5px;
}

.information .detail .fields .field .content .label {
  width: 45%;
  line-height: 25px;
  text-align: right;
}

.information .detail .fields .field .content .value {
  width: 55%;
  line-height: 25px;
  text-align: left;
}

.information .detail .fields .field .content .value input {
  width: 95%;
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
  margin: 5px;
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
    min-width: 90%;
  }

  .information .detail .fields .field .content .label {
    text-align: center;
  }

  .information .detail .fields .field .content .value {
    text-align: center;
  }
}
</style>