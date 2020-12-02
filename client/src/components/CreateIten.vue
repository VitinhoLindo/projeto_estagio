<template>
  <div class="new-iten">
    <div class="fields">
      <div class="label">
        <label>{{ language.labels['create-item-label'] }}</label>
      </div>

      <div class="values">
        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-name'] }}</label>
            <input type="text" v-model="input.nome.value">
            <span>{{ input.nome.error }}</span>
          </div>
        </div>

        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-model'] }}</label>
            <input type="text" v-model="input.modelo.value">
            <span>{{ input.nome.error }}</span>
          </div>
        </div>

        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-mark'] }}</label>
            <select v-model="input.marca.value">
              <option value="" disabled>options</option>
              <option v-for="(mark, index) in input.marca.values" v-bind:key="index" v-bind:value="mark.id">{{ mark.nome }}</option>
            </select>
            <span>{{ input.nome.error }}</span>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button :disabled="locked" @click="create">Criar</button>
        <button :disabled="locked" @click="cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageMixin from '../mixins/Language'

export default {
  mixins: [LanguageMixin],
  mounted() {
    this.mounted()
  },
  data() {
    return {
      locked: false,
      createMarkPid: 0,
      input: {
        nome: {
          value: '',
          error: ''
        },
        modelo: {
          value: '',
          error: ''
        },
        marca: {
          values: [],
          value: '',
          error: ''
        }
      }
    }
  },
  methods: {
    async mounted() {
      this.locked = true;
      this.$app.emit('loading', { on: true });

      try {
        let { status, code, result, message } = await this.$app.request({
          url: '/ma',
          method: 'get',
          encrypt: true
        });

        if (status == 'error') throw message;

        this.input.marca.values = result;
      } catch(error) {
        this.cancel();
        this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
      this.locked = false;
    },
    async create(event) {
      this.locked = true;
      this.$app.emit('loading', { on: true });

      try {
        let data = {};

        for(let key in this.input) {
          data[key] = this.input[key].value;
        }

        let { status, code, result, message } = await this.$app.request({
          url: '/it',
          method: 'POST',
          data: data,
          encrypt: true
        });

        if (status == 'error') throw (result.error || message);

        return this.$emit('created-item', event, result);
      } catch(err) {
        if (typeof err == 'object') 
          this.setError(err);
        else
          this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
      this.locked = false;
    },
    setError(error = {}) {
      for(let key in error) {
        if (this.input[key]) 
          this.input[key] = error[key];
      }
    },
    cancel(event) {
      this.locked = true;
      this.$emit('cancel', event);
    },
  }
}
</script>

<style lang="scss">
// 'flex-direction': 'row'
.new-iten {
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-iten .fields {
  min-width: 50%;
  min-height: 35%;
  -webkit-border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.new-iten .fields .values {
  min-width: 90%;
  min-height: calc(70% - 60px);
  max-height: calc(90% - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
}

.new-iten .fields .label {
  height: 50px;
  border-bottom: 1px solid #cccccc;
}

.new-iten .fields .label label {
  width: 100%;
  height: 20px;
  padding: 0%;
  font-size: 1.17em;
  color: #cccccc;
  // display: block;
  // font-weight: bold;
}

.new-iten .fields .values .inputs {
  overflow-y: auto;
  width: 100%;
  // min-height: calc(100% - 50px);
}
.new-iten .fields .values .inputs .field-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 15px auto;
}

.new-iten .fields .values .inputs .field-input label {
  text-align: center;
  line-height: 35px;
  width: 30%;
  font-size: 18px;
}

.new-iten .fields .values .inputs .field-input input {
  padding: 0px 10px;
  width: calc(60% - 20px);
  height: 35px;
}

.new-iten .fields .values .inputs .field-input select {
  width: 62%;
  height: 35px;
  text-align-last: center;
  font-size: 16px;
}


.new-iten .fields .buttons {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-iten .fields .buttons button {
  -webkit-border-radius: 5px;
  cursor: pointer;
  width: 80px;
  height: 35px;
  margin: auto 5px;
  background-color: #7ed6df;
  color: #ffffff;
  border: none;
}

.new-iten .fields .buttons button:hover {
  background-color: #5cb8c2;
}
.new-iten .fields .buttons button:focus {
  // outline: 0;
  background-color: #7ed6df;
}

.new-iten .fields .buttons button:disabled {
  cursor: auto;
  background-color: #c5f2f7;
}

@media only screen and (max-width: 768px) {
  .new-iten .fields {
    width: 95%;
    min-height: 90%;
  }

  .new-iten .fields .values .inputs .field-input {
    flex-direction: column;
    min-height: 70px;
    overflow-y: hidden;
  }

  .new-iten .fields .values .inputs .field-input input {
    text-align: center;
  }
}
</style>