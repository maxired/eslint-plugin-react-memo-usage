// lib/rules/no-bad-react-memo.js
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow bad usage of React.memo",
            category: "Best Practices",
            recommended: false,
        },
        fixable: "code",
        schema: [], // no options
    },
    create(context) {
        const memoComponents = {};

        return {
            // Detect React.memo usage
            CallExpression(node) {
                if (node.callee.object && node.callee.object.name === 'React' && node.callee.property && node.callee.property.name === 'memo') {
                    // Assuming the component is a variable declaration directly above
                    const parent = node.parent;
                    if (parent && parent.id && parent.id.name) {
                        // Track the component by name
                        memoComponents[parent.id.name] = true;
                    }
                }
            },
            // Analyze JSX elements
            JSXOpeningElement(node) {
                if (memoComponents[node.name.name]) {
                    node.attributes.forEach(attr => {
                        if (attr.type === 'JSXAttribute') {
                            const propName = attr.name.name;
                           

                            if (attr.value.type === 'Literal') {
                                return
                            } else if (attr.value.type === 'JSXExpressionContainer') {
                                if (attr.value.expression.type === 'ObjectExpression') {
                                    // defining a new object is not fine
                                    context.report({
                                        node: attr,
                                        message: `New prop '${propName}' passed to React.memo component '${node.name.name}'.`,
                                    });
                                    return
                                } else if (attr.value.expression.type === 'ArrowFunctionExpression' || attr.value.expression.type === 'FunctionExpression') {
                                    context.report({
                                        node: attr,
                                        message: `New prop '${propName}' passed to React.memo component '${node.name.name}'.`,
                                    });
                                    return
                                } else if(attr.value.expression.type === 'Identifier') {
                                    // I need to check where this identifier is defined
                                    let scope = context.getScope();
                                    let variable = scope.variables.find(v => v.name === attr.value.expression.name);
                                    if (variable) {
                                        if (variable.defs[0].type === 'Variable') {
                                            let init = variable.defs[0].node.init;
                                            if (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression' || init.type === 'ObjectExpression') {
                                                context.report({
                                                    node: attr,
                                                    message: `New prop '${propName}' passed to React.memo component '${node.name.name}'.`,
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    context.report({
                                        node: attr,
                                        message: `unsupported expression : ${attr.value.expression.type}`,
                                    });
                                }
                            }     
                        }
                    });
                }
            },
        };
    }
};
