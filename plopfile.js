//const changeCase = require("change-case");
module.exports = function (plop) {
  // plop.setHelper('camelCase', changeCase.camelCase);
  plop.setGenerator('template', {
    description: 'create demo template',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'demo name please'
    }],
    actions: [{
      type: 'add',
      path: 'src/demos/{{kebabCase name}}/index.js',
      //templateFile: 'template/index.js'
    }, {
      type: 'add',
      path: 'src/demos/{{kebabCase name}}/index.ts'
    }, {
      type: 'add',
      path: 'src/demos/{{kebabCase name}}/index.css'
    }, {
      type: 'add',
      path: 'src/demos/{{kebabCase name}}/index.html',
      templateFile: 'template/index.hbs'
    }, {
      type: 'modify',
      path: 'src/index.html',
      pattern: '<!-- Demo Insert Point -->',
      template: `<li><a href="./demos/{{kebabCase name}}/index.html">{{titleCase name}}</a></li>
    <!-- Demo Insert Point -->`
    }]
  })
}