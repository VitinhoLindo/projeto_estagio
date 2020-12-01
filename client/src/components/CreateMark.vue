<template>
  <div class="new-mark">
    <div class="fields">

      <div class="values">
        <div class="label">
          <label>{{ language.labels['create-mark-label'] }}</label>
        </div>

        <div class="inputs">
          <div class="field-input" :style="style">
            <label>{{ language.labels['item-name'] }}</label>
            <input type="text" v-model="markInput.nome.value">
          </div>
          <div class="error">
            <span>{{ markInput.nome.error }}</span>
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
  mounted() {
    this.newItenlisten();
    this.$app.resize();
  },
  mixins: [LanguageMixin],
  data() {
    return {
      locked: false,
      createMarkPid: 0,
      markInput: {
        nome: {
          value: '',
          error: ''
        }
      },
      style: {
        'flex-direction': 'row'
      },
      count: 0
    }
  },
  methods: {
    async create(event, count = 0, error = '') {
      this.locked = true;
      this.$app.emit('loading', { on: true });

      let req = {
        success: null,
        error: null,
        trying: 0,
        maxTrying: 5
      };

      let data = {};
      for(let key in this.markInput) {
        data[key] = this.markInput[key].value;
      }

      while(req.trying < req.maxTrying) {
        try {
          let { status, code, result, message } = await this.$app.request({
            url: '/mark',
            method: 'POST',
            data: data,
            encrypt: true
          });

          if (status != 'error') {
            req.success = result;
            break;
          } else {
            if (!result.error) {
              throw message;
            } else {
              this.setErrorFields(result.error);
              break;
            }
          }
        } catch(err) {
          req.trying++;
          req.error = err;
        }
      }

      this.locked = false;
      this.$app.emit('loading', { on: false });

      if (req.success) {
        return this.$emit('created-mark', event, req.success);
      } 
      if (req.error) {
        return this.$emit('error', { message: req.error, show: true });
      }
    },
    showError(error = '') {
      return this.$app.emit('error', { message: error, show: true });
    },
    setErrorFields(error = {}) {
      for(let key in error) {
        if (!this.markInput[key]) continue;
        this.markInput[key].error = error[key];
      }
    },
    cancel(event) {
      this.locked = true;
      this.$emit('cancel', event);
    },
    newItenlisten() {
      this.$app.on('resize', (offset) => {
        if (offset.innerWidth <= 600) {
          this.style['flex-direction'] = 'column';
        } else {
          this.style['flex-direction'] = 'row';
        }
      }, (err, pid) => {
        if (err) throw err;
        this.createMarkPid = pid;
      });
    },
  },
  unmounted() {
    this.$app.removeListiner('resize', this.createMarkPid);
  }
}
</script>

<style lang="scss">
.new-mark {
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

.new-mark .fields {
  padding: 10px;
  min-width: 40%;
  -webkit-border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.new-mark .fields .values {
  width: 90%;
  height: calc(95% - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.new-mark .fields .values .label {
  padding: 5px;
  max-height: 50px;
}

.new-mark .fields .values .label label {
  width: 100%;
  min-height: 20px;
  padding: 0%;
  font-size: 1.17em;
  color: #cccccc;
}

.new-mark .fields .values .inputs {
  overflow-y: auto;
  width: 100%;
}

.new-mark .fields .values .inputs .field-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(100% - 12px);
  padding: 5px;
  margin: 15px auto;
  -webkit-border-radius: 5px;
  border: 1px solid #cccccc;

  label {
    text-align: center;
    line-height: 35px;
    width: 30%;
    font-size: 18px;
  }

  input {
    border: 1px solid #cccccc;
    padding: 0px 10px;
    width: calc(60% - 20px);
    height: 35px;
    -webkit-border-radius: 5px;
  }

  input:focus {
    outline: 0;
    border: 1px solid #0984e3;
  }

  select {
    width: 62%;
    height: 35px;
    text-align-last: center;
    font-size: 16px;
  }
}

.new-mark .fields .values .inputs .error {
  width: 100%;
  display: flex;
  justify-content: flex-end;

  span {
    margin-top: -10px;
    color: red;
    font-size: 12px;
    width: calc(75% - 20px);
    text-align: center;
  }
}

.new-mark .fields .buttons {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    -webkit-border-radius: 5px;
    cursor: pointer;
    width: 80px;
    height: 35px;
    margin: auto 5px;
    background-color: #7ed6df;
    color: #ffffff;
    border: none;
  }

  button:hover {
    background-color: #5cb8c2;
  }

  button:focus {
    outline: 0;
    background-color: #7ed6df;
  }

  button:disabled {
    cursor: auto;
    background-color: #c5f2f7;
  }
}

@media only screen and (max-width: 768px) {
  .new-mark .fields {
    min-width: 70%;
  }

  .new-mark .fields .values .inputs .field-input {
    border: none;
  }

  .new-mark .fields .values .inputs .error span {
    margin-top: -17px;
    width: 100%;
  }
}
</style>