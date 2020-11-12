<template>
<div class="menu">
  <div class="icon" @click="menuShow" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <svg focusable="false" viewBox="0 0 24 24">
      <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path>
    </svg>

    <div class="span" v-if="spanMenu.show" v-bind:style="spanMenu.style">
      <div><strong>{{ language.labels['menu-span-title'] }}</strong></div>
      <div>{{ language.labels['menu-span-content'] }}</div>
    </div>
  </div>

  <div class="menu-language" @mouseenter="showLanguageOption" @mouseleave="closeLanguageOption">
    <div class="span" v-if="spanLanguageMenu.show && !menuLanguage.show" v-bind:style="spanLanguageMenu.style">
      <div><strong>{{ language.labels['menu-span-title'] }}</strong></div>
      <div>{{ language.labels['menu-span-language'] }}</div>
    </div>

    <div v-if="!menuLanguage.show" class="language-message" @click="changeLanguageMenu">
      {{ language.labels[language.lang] }}
    </div>
    <div v-else class="language-option" @mouseleave="closeChangeLanguageMenu">
      <select @change="changedLanguageMenu" v-bind:value="language.lang">
        <option v-for="(lang, index) in $app.$langs()" v-bind:key="index" v-bind:value="lang">
          {{ language.labels[lang] }}
        </option>
      </select>
    </div>
  </div>

  <div class="menu-buttons" v-if="show" @mouseleave="closeMenu">
    <div v-for="(menuOption, index) in menus" v-bind:key="index" @click="(event) => menuOptionClick(event, menuOption)">
      {{ language.labels[menuOption.label] }}
    </div>
  </div>
</div>
</template>

<script>
import LanguageMixins from '../mixins/Language'

export default {
  name: 'Menu',
  mixins: [LanguageMixins],
  data() {
    return {
      show: false,
      spanMenu: {
        show: false,
        style: {}
      },
      spanLanguageMenu: {
        show: false,
        style: {}
      },
      menus: [{
          label: 'menu-home',
          redirect: '/'
        }, {
          label: 'menu-iten',
          redirect: '/itens'
        },
        {
          label: 'menu-collaborator',
          redirect: '/collaborators'
        }
      ],
      menuLanguage: {
        show: false
      }
    };
  },
  methods: {
    menuShow(event) {
      this.show = true;
    },
    closeMenu(event) {
      this.show = false;
    },
    showLanguageOption(event) {
      let {
        x,
        y
      } = event;
      this.spanLanguageMenu.show = true;
      this.spanLanguageMenu.style = {
        top: `${y}px`,
        left: `${x}px`
      }
    },
    closeLanguageOption(event) {
      this.spanLanguageMenu = {
        show: false,
        style: {}
      };
    },
    changeLanguageMenu(event) {
      this.menuLanguage.show = true;
    },
    closeChangeLanguageMenu(event) {
      this.menuLanguage.show = false;
    },
    async changedLanguageMenu(event) {
      await this.$app.getLang(event.srcElement.value);
    },
    menuOptionClick(event, data) {
      this.$router.push({
        path: data.redirect
      });
    },
    mouseenter(event) {
      let {
        x,
        y
      } = event;

      this.spanMenu = {
        show: true,
        style: {
          top: `${y}px`,
          left: `${x}px`
        }
      };
    },
    mouseleave(event) {
      this.spanMenu = {
        show: false,
        style: {}
      };
    }
  }
}
</script>

<style lang="scss">
.span {
  position: fixed;
  z-index: 5;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  -webkit-border-radius: 2px;
  min-width: 60px;
  min-height: 14px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 12px;
  font-size: 10px;
}

.menu {
  position: absolute;
  background-color: rgba($color:#2980b9, $alpha: 1.0);
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 2;
  display: flex;
  align-items: center;

  .menu-language {
    min-width: 35px;
    height: 35px;

    .language-message {
      line-height: 35px;
      cursor: pointer;
      color: #ffffff;
    }

    margin: auto 5px;
  }

  .language-option {
    min-width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    select {
      border: none;
      background-color: #ffffff;
      font-size: 14px;
      min-width: 50px;
      height: 25px;
      -webkit-border-radius: 2px;
    }
  }

  .menu-buttons {
    top: calc(0px + 40px);
    position: absolute;
    overflow-y: auto;
    min-width: 100px;
    min-height: 40px;

    div {
      min-width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      padding: 4px;
      min-height: 30px;
      background-color: rgba($color: #3498db, $alpha: 1);
      color: #ffffff;
      margin: 2px;
      cursor: pointer;
    }

    div:hover {
      background-color: rgba($color: #3498db, $alpha: 0.8);
    }
  }

  .icon {
    width: 35px;
    height: 35px;
    fill: #ffffff;
    cursor: pointer;
  }

  .icon:hover {
    fill: rgba($color: #ffffff, $alpha: 0.5);
  }

  .menu-buttons {}
}
</style>
