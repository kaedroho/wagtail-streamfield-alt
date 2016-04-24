import * as React from 'react';

import {StreamBlock, streamBlockReducerBuilder} from './stream_block';
import {StructBlock} from './struct_block';
import {CharBlock, TextBlock, RichTextBlock, ImageChooserBlock} from './field_block';


let BLOCK_TYPES_REGISTRY = {
    'wagtail.core.StreamBlock': StreamBlock,
    'wagtail.core.StructBlock': StructBlock,
    'wagtail.core.CharBlock': CharBlock,
    'wagtail.core.TextBlock': TextBlock,
    'wagtail.core.RichTextBlock': RichTextBlock,
    'wagtail.images.ImageChooserBlock': ImageChooserBlock,
};

let BLOCK_REDUCER_BUILDERS_REGISTRY = {
    'wagtail.core.StreamBlock': streamBlockReducerBuilder,
};


// TEMPORARY: A placeholder to stop code from crashing due to missing blocks
class UnknownBlock extends React.Component {
    render() {
        return <p>yay</p>;
    }
}


export function renderBlock(store, value, schema, path) {
    let Component = BLOCK_TYPES_REGISTRY[schema.type] || UnknownBlock;
    return <Component store={store} value={value} schema={schema} path={path} />;
}


export function getBlockReducer(schema) {
    return BLOCK_REDUCER_BUILDERS_REGISTRY[schema.type](schema) || ((state, action) => state);
}
