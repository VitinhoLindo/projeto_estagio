<template>
<div class="error" v-if="errorValues.show">
  <div class="internal">
    <div class="title">
      {{ language.labels['error-title'] }}
    </div>
    <div class="content">
      <p v-for="(message, index) in errorValues.message" v-bind:key="index">
        {{ message }}
      </p>
    </div>
    <div class="button">
      <button @click="errorClick">
        {{ language.labels['error-button'] }}
      </button>
    </div>
  </div>
</div>
</template>

<script>
import LanguageMixin from '../mixins/Language'
import ErrorMixin from '../mixins/Error'

export default {
  name: 'Error',
  mixins: [LanguageMixin, ErrorMixin]
}
</script>

<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.2);

  .internal {
    width: 350px;
    max-height: 350px;
    background-color: #ffffff;
    -webkit-border-radius: 5px;

    .title {
      width: 100%;
      height: 40px;
      text-align: center;
      vertical-align: middle;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
    }

    .content {
      width: 100%;
      min-height: 42px;
      max-height: 270px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-y: auto;

      p {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }

    .button {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      button {
        -webkit-border-radius: 5px;
        height: 80%;
        border: none;
        background-color: rgba($color: #425bed, $alpha: 1.0);
        cursor: pointer;
        color: #ffffff;
      }

      button:hover {
        background-color: rgba($color: #425bed, $alpha: 0.8);
      }

      button:focus {
        outline: 0;
      }
    }
  }
}
</style>
