import * as React from 'react';

import {renderBlock, getBlockReducer} from '.';


export function structBlockReducerBuilder(schema) {
    return (state=[], action) => {
        if (!action.pathComponents.length) {
            // Action is for this block
        } else {
            // Action is for a child block
            let fieldName = action.pathComponents[0];
            let newAction = Object.assign({}, action, {
                pathComponents: action.pathComponents.slice(1),
            });

            return Object.assign({}, state, {
                [fieldName]: getBlockReducer(schema.child_blocks[fieldName])(state[fieldName], newAction),
            });
        }

        return state;
    }
}


export class StructBlock extends React.Component {
    render() {
        let fields = [];

        for (let field in this.props.value) {
            let value = this.props.value[field];
            let schema = this.props.schema.child_blocks[field];
            let path = `${this.props.path}-${field}`;

            fields.push(
                <li key={field}>
                    <label for={path}>{schema.label}</label>
                    {renderBlock(this.props.store, value, schema, path)}
                </li>
            );
        }

        return <div className="struct-block">
            <ul className="fields">
                {fields}
            </ul>
        </div>;
    }
}
