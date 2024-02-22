const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-bad-react-memo');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

ruleTester.run('no-bad-react-memo', rule, {
  valid: [
    // List of code snippets that should NOT trigger your rule
    `
     const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
     const Foo = () => <Component bar='bar'>Foo</Component>;
    `,
    `const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });`,
    // Add more valid examples as needed
     `function Bar(){};
      const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => <Component bar={Bar}>Foo</Component>;`,

      `
      const Bar = () => {};
      const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => <Component bar={Bar}>Foo</Component>;`,
      ` const Bar = {}; 
      const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => {
       
        return <Component bar={Bar}>Foo</Component>;
      }`
  ],

  invalid: [
    // List of code snippets that SHOULD trigger your rule
    {
      code: `const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => <Component bar={{}}>Foo</Component>;`,
      errors: [{ message: `New prop 'bar' passed to React.memo component 'Component'.`, type: 'JSXAttribute' }],
      //   // Optionally, you can include an `output` property if your rule is fixable
      ////  // output: `Corrected code snippet`
    },

    {
      code: `const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => <Component bar={() => {}}>Foo</Component>;`,
      errors: [{ message: `New prop 'bar' passed to React.memo component 'Component'.`, type: 'JSXAttribute' }],
      //   // Optionally, you can include an `output` property if your rule is fixable
      ////  // output: `Corrected code snippet`
    },

    {
      code: `
     
      const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => {
        const Bar = () => {};
        return <Component bar={Bar}>Foo</Component>;
      }`,
      errors: [{ message: `New prop 'bar' passed to React.memo component 'Component'.`, type: 'JSXAttribute' }],
      //   // Optionally, you can include an `output` property if your rule is fixable
      ////  // output: `Corrected code snippet`
    },

    {
      code: `
     
      const Component = React.memo(function Component(props) { return <div>{props.children}</div>; });
      const Foo = () => {
        const Bar = {};
        return <Component bar={Bar}>Foo</Component>;
      }`,
      errors: [{ message: `New prop 'bar' passed to React.memo component 'Component'.`, type: 'JSXAttribute' }],
      //   // Optionally, you can include an `output` property if your rule is fixable
      ////  // output: `Corrected code snippet`
    },
    
    // Add more invalid examples as needed
  ]
});

