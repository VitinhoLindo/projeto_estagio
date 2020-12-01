<template>
  <div class="new-rent">
    <div class="fields">
      <div class="label">
        <label>{{ language.labels['create-rent-label'] }}</label>
      </div>

      <div class="values">
        <div class="inputs">

          <div class="field-input">
            <label>{{ language.labels['field-collaborator'] }}</label>
            <select v-model="input.colaborador.value">
              <option value="" disabled>{{ language.labels['select-option'] }}</option>
              <option v-for="(colaborador, index) in input.colaborador.values" v-bind:key="index" v-bind:value="colaborador.id">
                {{ colaborador.nome }}
              </option>
            </select>
          </div>
          <div class="error">
            <span>{{ input.colaborador.error }}</span>
          </div>
        </div>

        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-iten'] }}</label>
            <select v-model="input.iten.value">
              <option value="" disabled>{{ language.labels['select-option'] }}</option>
              <option v-for="(iten, index) in input.iten.values" v-bind:key="index" v-bind:value="iten.id">
                {{ iten.nome }}
              </option>
            </select>
          </div>
          <div class="error">
            <span>{{ input.iten.error }}</span>
          </div>
        </div>

        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-expiration'] }}</label>
            <input type="date" v-model="input.expiration_at.date">
          </div>
          <div class="error">
            <span>{{ input.expiration_at.error }}</span>
          </div>
        </div>

        <div class="inputs">
          <div class="field-input">
            <label>{{ language.labels['field-hour'] }}</label>
            <input type="time" v-model="input.expiration_at.time">
          </div>
          <div class="error">
            <span>{{ input.expiration_at.error }}</span>
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
        iten: {
          values: [],
          value: '',
          error: ''
        },
        colaborador: {
          values: [],
          value: '',
          error: ''
        },
        expiration_at: {
          date: '',
          time: '',
          value: '',
          error: ''
        }
      }
    }
  },
  methods: {
    async mounted(count = 0, error = '') {
      if (count == 5) {
        this.$app.emit('error', { message: error, show: true });
        return this.cancel();
      }

      this.locked = true;
      this.$app.emit('loading', { on: true });

      try {
        let [ itens, collaborators ] = await Promise.all([
          this.$app.request({
            url: '/itens',
            method: 'get',
            encrypt: true
          }),
          this.$app.request({
            url: '/collaborators',
            method: 'get',
            encrypt: true
          })
        ]);

        if (itens.status == 'error') throw itens.message;
        if (collaborators.status == 'error') throw collaborators.message;

        this.input.iten.values = itens.result;
        this.input.colaborador.values = collaborators.result;
      } catch(error) {
        return this.mounted(count++, error);
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
          if (key == 'expiration_at') {
            data[key] = new Date(`${this.input[key].date} ${this.input[key].time}`);
          }
          else {
            data[key] = this.input[key].value;
          }
        }

        let { status, code, result, message } = await this.$app.request({
          url: '/rent',
          method: 'POST',
          data: data,
          encrypt: true
        });

        if (status == 'error') {
          if (result.error) {
            for(let key in result.error) {
              this.input[key].error = result.error[key];
              console.log(key);
            }
            this.locked = false;
            this.$app.emit('loading', { on: false });
            return;
          }
          else throw message;
        }

        this.locked = false;
        return this.$emit('created-item', event, result);
      } catch(error) {
        this.$app.emit('error', { message: error, show: true });
      }

      this.$app.emit('loading', { on: false });
      this.locked = false;
    },
    cancel(event) {
      this.locked = true;
      this.$emit('cancel', event);
    },
  }
}
</script>

<style lang="scss">
.new-rent {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-rent .fields {
  min-width: 50%;
  min-height: 35%;
  -webkit-border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.new-rent .fields .values {
  min-width: 90%;
  min-height: calc(70% - 60px);
  max-height: calc(90% - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.new-rent .fields .label {
  height: 50px;
  border-bottom: 1px solid #cccccc;
}

.new-rent .fields .label label {
  width: 100%;
  height: 20px;
  padding: 0%;
  font-size: 1.17em;
  color: #cccccc;
}

.new-rent .fields .values .inputs {
  overflow-y: auto;
  width: 100%;
}

.new-rent .fields .values .inputs .error {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.new-rent .fields .values .inputs .error span {
  margin-top: -10px;
  color: red;
  font-size: 12px;
  width: calc(75% - 20px);
  text-align: center;
}

.new-rent .fields .values .inputs .field-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 15px auto;
}

.new-rent .fields .values .inputs .field-input label {
  text-align: center;
  line-height: 35px;
  width: 30%;
  font-size: 18px;
}

.new-rent .fields .values .inputs .field-input input {
  padding: 0px 10px;
  width: calc(60% - 20px);
  height: 35px;
}

.new-rent .fields .values .inputs .field-input select {
  width: 62%;
  height: 35px;
  text-align-last: center;
  font-size: 16px;
}


.new-rent .fields .buttons {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-rent .fields .buttons button {
  -webkit-border-radius: 5px;
  cursor: pointer;
  width: 80px;
  height: 35px;
  margin: auto 5px;
  background-color: #7ed6df;
  color: #ffffff;
  border: none;
}

.new-rent .fields .buttons button:hover {
  background-color: #5cb8c2;
}
.new-rent .fields .buttons button:focus {
  // outline: 0;
  background-color: #7ed6df;
}

.new-rent .fields .buttons button:disabled {
  cursor: auto;
  background-color: #c5f2f7;
}

@media only screen and (max-width: 768px) {
  .new-rent .fields {
    width: 95%;
    min-height: 90%;
  }

  .new-rent .fields .values .inputs .field-input {
    flex-direction: column;
    min-height: 70px;
    overflow-y: hidden;
  }

  .new-rent .fields .values .inputs .field-input input {
    text-align: center;
  }
}
</style>