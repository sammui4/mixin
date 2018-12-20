<template>
  <div class="hkm-context-menu" 
    v-show="config.show"
    :style="{left: config.left, top: config.top}">

    <div 
      class="hkm-context-memu__item"
      v-for="item in config.menuItems"
      :key="item.value"
      @click="handleClick(item.value)">
      <span>{{item.text}}</span>
    </div>   
                      
  </div>
</template>

<script>
export default {
  name: 'HkmContextMenu',

  props: {
    config: {
      type: Object,
      required: true
    }
  },

  methods: {
    handleClick (value) {
      this.$emit('menu-item-click', value);
    }
  },

  mounted () {
    document.body.appendChild(this.$el);
  },

  beforeDestroy () {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang="scss">
  @import '../../_assets/scss/variable.scss';

  .hkm-context-menu {
    position: fixed;
    z-index: 101;
    border: 1px solid $border-color;
    border-top: none;
    background: #fff;
    color: #000;
  }

  .hkm-context-memu__item {
    border-top: 1px solid $border-color;
    box-sizing: border-box;
    text-align: left;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
</style>


