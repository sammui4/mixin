<template>
  <div class="hkm-checkbox" :class="{'is-checked': value}">
    <span class="hkm-checkbox__inner" @click.stop="handleClick"></span>
    <input type="checkbox" class="hkm-checkbox__original" :checked="value">
  </div>
</template>

<script>
export default {
  name: 'HkmCheckbox',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClick () {
      this.$emit('click');
    }
  }
}
</script>

<style lang="scss">
@import '../_assets/scss/variable.scss';

.hkm-checkbox {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  overflow: hidden;

  &.is-checked {
    .hkm-checkbox__inner {
      background-color: $main-color;
      border-color: $main-color;

      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
  }
}

.hkm-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #000;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #fff;
  z-index: 1;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46), background-color .25s cubic-bezier(.71,-.46,.29,1.46);

  &:after {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform .15s ease-in .05s;
    transform-origin: center;
  }

  &:hover {
    border-color: $main-color;
  }
}

.hkm-checkbox__original {
  opacity: 0;
  outline: none;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}
</style>



