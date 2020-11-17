<template>
  <div class="new-item">
    <div class="fields">

      <div class="values">
        <div class="label">
          <label>{{ language.labels['create-item-label'] }}</label>
        </div>

        <div class="inputs">
          <div class="field-input" :style="style">
            <label>{{ language.labels['item-name'] }}</label>
            <input type="text" v-model="itemInput.name.value">
            <span>{{ itemInput.name.error }}</span>
          </div>

          <div class="field-input" :style="style">
            <label>{{ language.labels['item-model'] }}</label>
            <input type="text" v-model="itemInput.model.value">
            <span>{{ itemInput.model.error }}</span>
          </div>

          <div class="field-input" :style="style">
            <label>{{ language.labels['item-mark'] }}</label>
            <select v-model="itemInput.mark.value"><option value="">Sei lá</option></select>
            <span>{{ itemInput.mark.error }}</span>
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
import LanguageMixins from '../mixins/Language'

export default {
  name: 'NewItem',
  mixins: [LanguageMixins],
  mounted() {
    this.newItenlisten();
    this.$app.resize();
    this.getData();
  },
  data() {
    return {
      locked: false,
      style: {
        'flex-direction': 'row'
      },
      newItenPid: 0,
      itemInput: {
        name: {
          value: '',
          error: ''
        },
        model: {
          value: '',
          error: ''
        },
        mark: {
          value: '',
          error: ''
        }
      }
    }
  },
  methods: {
    newItenlisten() {
      this.$app.on('resize', (offset) => {
        if (offset.innerWidth <= 600) {
          this.style['flex-direction'] = 'column';
        } else {
          this.style['flex-direction'] = 'row';
        }
      }, (err, pid) => {
        if (err) throw err;
        this.newItenPid = pid;
      });
    },
    async getData() {
      this.$app.emit('loading', { on: true });

      await this.$app.sleep(4);
      this.$app.emit('loading', { on: false });
    },
    create() {
      this.locked = true;
    },
    cancel(event) {
      this.locked = true;
      this.$emit('cancel', event);
    }
  },
  unmounted() {
    console.log(this.newItenPid);
    this.$app.removeListiner('resize', this.newItenPid);
  }
}
</script>

<style lang="scss">
.new-item {
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
    height: 50%;
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
            width: 60%;
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