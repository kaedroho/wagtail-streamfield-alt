import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {renderBlock} from './blocks';


export function init(element, schema) {
    // Get data
    let dataElement = element.querySelector('input[type="hidden"]');
    let data = JSON.parse(dataElement.value);

    // Render
    let uiElement = element.querySelector('div.streamfield-alt-ui')
    ReactDOM.render(renderBlock(data, schema, 'body'), uiElement);

}
