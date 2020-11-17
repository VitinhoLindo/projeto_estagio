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
      }
    }
  },
  methods: {
    async create(event) {
      this.locked = true;
      this.$app.emit('loading', { on: true });

      let data = {};

      for(let key in this.markInput) {
        data[key] = this.markInput[key].value;
      }

      try {
        let { status, code, result, message } = await this.$app.request({
          url: '/mark',
          method: 'POST',
          data: data,
          encrypt: true
        });

        this.locked = false;
        this.$emit('created-mark', event, result);
        return;
      } catch(err) {
      }

      this.$app.emit('loading', { on: false });
      this.locked = false;
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

  .fields {
    width: 50%;
    height: 35%;
    -webkit-border-radius: 10px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .values {
      width: 90%;
      height: calc(95% - 60px);
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;

      .label {
        height: 50px;
        border-bottom: 1px solid #cccccc;
        label {
          width: 100%;
          height: 20px;
          padding: 0%;
          font-size: 1.17em;
          color: #cccccc;
          // display: block;
          // font-weight: bold;
        }
      }

      .inputs {
        overflow-y: auto;
        width: 100%;
        height: calc(100% - 50px);

        .field-input {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 40px;
          margin: 15px auto;

          label {
            text-align: center;
            line-height: 35px;
            width: 30%;
            font-size: 18px;
          }

          input {
            padding: 0px 10px;
            width: calc(60% - 20px);
            height: 35px;
          }

          select {
            width: 62%;
            height: 35px;
            text-align-last: center;
            font-size: 16px;
          }
        }
      }
    }


    .buttons {
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
        // outline: 0;
        background-color: #7ed6df;
      }

      button:disabled {
        cursor: auto;
        background-color: #c5f2f7;
      }
    }
  }
}
</style>