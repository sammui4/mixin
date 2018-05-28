import waves from './waves'
// const install = function(Vue) {
//   Vue.directive('wave', waves)
// }

// if (window.Vue) {
//   window.waves = waves
//   Vue.use(install); // eslint-disable-line
// }

// waves.install = install
// export default waves
export default (Vue)=>{
  Vue.directive('wave', waves)
}