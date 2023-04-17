// module.exports = function(plop) {
//   // create your generators here
//   plop.setGenerator('basics', {
//     description: 'this is a skeleton plopfile',
//     prompts: [], // array of inquirer prompts
//     actions: [] // array of actions
//   })
// }
const viewGenerator = require('./plop-templates/view/prompt')
const storeGenerator = require('./plop-templates/store/prompt')
const componentGenerator = require('./plop-templates/component/prompt')

module.exports = function(plop) {
  // controller generator
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('store', storeGenerator)
  plop.setGenerator('component', componentGenerator)
}
