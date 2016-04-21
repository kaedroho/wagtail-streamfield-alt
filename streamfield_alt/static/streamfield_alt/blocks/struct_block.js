import * as React from 'react';

import {renderBlock} from '.';


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
                    {renderBlock(value, schema, path)}
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
