<template>
  <div class="login">
    <div class="content">
      <div class="fields">
        <div class="field">
          <div>
            <label for="">e-mail</label>
          </div>
          <input type="email" v-model="inputs.email.value">
          <div class="error">
            {{ inputs.email.error }}
          </div>
        </div>

        <div class="field">
          <div>
            <label>password</label>
          </div>
          <input type="password" v-model="inputs.senha.value">
          <div class="error">
            {{ inputs.senha.error }}
          </div>
        </div>
      </div>

      <div class="button">
        <button v-on:click="login" v-bind:disabled="blocked">sing-in</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      inputs: {
        email: {
          value: '',
          error: ''
        },
        senha: {
          value: '',
          error: ''
        }
      },
      blocked: false
    }
  },
  mounted() {
    this.$app.emit('loading', { on: false });
  },
  methods: {
    async login() {
      this.blocked = true;
      this.$app.emit('loading', { on: true });

      try {
        let values = {};

        for(let key in this.inputs) {
          values[key] = await this.$app.hash(this.inputs[key].value);
        }

        let { code, message, result, status } = await this.$app.request({
          url: '/auth',
          method: 'post',
          data: values,
          encrypt: true
        });

        if (status == 'error') throw (result.error || message);

        this.$app.authentication(result);
      } catch (error) {
        if (typeof error != 'string') this.showError(error);
        else this.$app.emit('error', { message: error, show: true }); 
      }

      this.$app.emit('loading', { on: false });
      this.blocked = false;
    },
    showError(error = {}) {
      for (let key in error) {
        if (this.inputs[key])
          this.inputs[key].error = error[key];
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #34495e, $alpha: 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.login .content {
  padding: 20px;
  width: 320px;
  height: 220px;
  background-color: #ffffff;
  -webkit-border-radius: 5px;
}

.login .content .fields {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login .content .fields .field {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login .content .fields .field div {
  width: 25%;
  margin: 5px 0px;
  font-size: 18px;
  text-align: center;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #7a7a7a;
}

.login .content .fields .field .error {
  font-size: 10px;
  color: red;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.login .content .fields .field input {
  padding: 4px;
  border: 1px solid #4d4d4d;
  color: #4d4d4d;
  width: 80%;
  font-size: 18px;
  text-align: center;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.login .content .fields .field input:focus {
  outline: 0;
  border: 1px solid rgba($color:#3498db, $alpha: 1.0);
  color: rgba($color:#3498db, $alpha: 1.0);
}

.login .content .button {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .content .button button {
  cursor: pointer;
  width: calc(100%);
  height: 100%;
  border: none;
  -webkit-border-radius: 5px;
  color: #ffffff;
  font-size: 18px;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: rgba($color:#3498db, $alpha: 1.0);
}

.login .content .button button:hover {
  opacity: 0.6;
}

.login .content .button button:focus {
  outline: 0;
}

.login .content .button button:disabled {
  opacity: 0.2;
  cursor: auto;
}
</style>