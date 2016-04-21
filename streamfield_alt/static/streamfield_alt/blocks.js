import * as React from 'react';


class StreamMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };
    }

    getClassNames() {
        let classNames = ['stream-menu'];

        if (!this.state.isOpen) {
            classNames.push('stream-menu-closed');
        }

        return classNames;
    }

    onToggle(e) {
        this.state.isOpen = !this.state.isOpen;
        this.setState(this.state);

        e.preventDefault();
        return false;
    }

    render() {
        let choices = [];

        for (let choice in this.props.schema.child_blocks) {
            let schema = this.props.schema.child_blocks[choice];

            choices.push(
                <li key={choice}>
                    <button type="button" className="action-add-block-h2 icon icon-title"><span>{schema.label}</span> </button>
                </li>
            );
        }

        let menu = [];
        if (this.state.isOpen) {
            menu = <div key="menu" className="stream-menu-inner">
                <ul>
                    {choices}
                </ul>
            </div>
        }

        return <div className={this.getClassNames().join(' ')} id={this.props.id}>
            <a className="toggle" onClick={e => this.onToggle(e)}><span>Insert block</span></a>
            <React.addons.CSSTransitionGroup transitionName="stream-menu" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                {menu}
            </React.addons.CSSTransitionGroup>
        </div>;
    }
}

class StreamChild extends React.Component {
    render() {
        return <li id={`${this.props.path}-container`} className={`sequence-member blockname-${this.props.type}`}>
            <div className="sequence-controls">
                <h3><label for={`${this.props.path}-value`}>{this.props.schema.label}</label></h3>
                <div className="button-group button-group-square">
                    <button type="button" id={`${this.props.path}-moveup`} title="Move up" className="icon text-replace icon-order-up disabled">Move up</button>
                    <button type="button" id={`${this.props.path}-movedown`} title="Move down" className="icon text-replace icon-order-down">Move down</button>
                    <button type="button" id={`${this.props.path}-delete`} title="Delete" className="icon text-replace hover-no icon-bin">Delete</button>
                </div>
            </div>
            <div className="sequence-member-inner ">
                {renderBlock(this.props.value, this.props.schema, this.props.path)}
            </div>
            <StreamMenu id={`${this.props.path}-appendmenu`} schema={this.props.parentSchema} />
        </li>;
    }
}

class StreamBlock extends React.Component {
    render() {
        let childBlocks = [];

        for (let id in this.props.value) {
            let path = `${this.props.path}-${id}`;
            let type = this.props.value[id].type;
            let value = this.props.value[id].value;
            let schema = this.props.schema.child_blocks[type];

            childBlocks.push(<StreamChild key={id} path={path} type={type} value={value} schema={schema} parentSchema={this.props.schema} />);
        }

        return <div className="field block_field block_widget ">
            <div className="field-content">
                <div className="input  ">
                    <div className="sequence-container sequence-type-stream">
                        <StreamMenu id={`${this.props.path}-prependmenu`} schema={this.props.schema} />

                        <div className="sequence-container-inner">
                            <ul id="body-list" className="sequence">
                                {childBlocks}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

class StructBlock extends React.Component {
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

class CharBlock extends React.Component {
    render() {
        return <div className="field char_field widget-text_input fieldname-attribution">
            <div className="field-content">
                <div className="input">
                    <input id={this.props.path} name={this.props.path} placeholder={this.props.schema.label} defaultValue={this.props.value} type="text" />
               </div>
            </div>
        </div>;
    }
}

class TextBlock extends React.Component {
    render() {
        return <div className="field char_field widget-admin_auto_height_text_input fieldname-quote">
            <div className="field-content">
                <div className="input">
                    <textarea style={{overflow: 'hidden', wordWrap: 'break-word', resize: 'horizontal', height: '93px'}} data-autosize-on="true" cols="40" id={this.props.path} name={this.props.path} placeholder={this.props.schema.label} rows="1" defaultValue={this.props.value} />
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        autosize($(`#${this.props.path}`));
    }
}

class RichTextBlock extends React.Component {
    render() {
        return <div className="field char_field widget-rich_text_area fieldname-paragraph">
            <div className="field-content">
                <div className="input">
                    <textarea cols="40" id={`${this.props.path}-value`} name={`${this.props.path}-value`} placeholder="Paragraph" rows="10" defaultValue={this.props.value} />
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        makeRichTextEditable(`${this.props.path}-value`);
    }
}

class ImageChooserBlock extends React.Component {
    render() {
        return <div className="field model_choice_field widget-admin_image_chooser fieldname-image">
            <div className="field-content">
                <div className="input">
                    <div id={`${this.props.path}-chooser`} className="chooser image-chooser">
                        <div className="chosen">
                            <div className="preview-image">
                                <img alt="Wagtail collects insects by Margrit" className="show-transparency" src="/media/images/wagtail_collects_insects_by_Maggi_94.max-165x165.jpg" height="102" width="165" />
                            </div>
                            <ul className="actions">
                                <li>
                                    <button type="button" className="action-choose button-small button-secondary">Choose another image</button>
                                </li>
                                <li><a href={`/admin/images/${this.props.value}/`} className="edit-link button button-small button-secondary" target="_blank">Edit this image</a> </li>
                            </ul>
                        </div>
                        <div className="unchosen">
                            <button type="button" className="action-choose button-small button-secondary">Choose an image</button>
                        </div>
                    </div>
                    <input id={this.props.path} name={this.props.path} placeholder={this.props.schema.label} value={this.props.value} type="hidden" />
                </div>
            </div>
        </div>
    }

    componentDidMount() {
        createImageChooser(this.props.path);
    }
}


let BLOCK_TYPES_REGISTRY = {
    'wagtail.core.StreamBlock': StreamBlock,
    'wagtail.core.StructBlock': StructBlock,
    'wagtail.core.CharBlock': CharBlock,
    'wagtail.core.TextBlock': TextBlock,
    'wagtail.core.RichTextBlock': RichTextBlock,
    'wagtail.images.ImageChooserBlock': ImageChooserBlock,
}

// TEMPORARY: A placeholder to stop code from crashing due to missing blocks
class UnknownBlock extends React.Component {
    render() {
        return <p>yay</p>;
    }
}


export function renderBlock(value, schema, path) {
    let Component = BLOCK_TYPES_REGISTRY[schema.type] || UnknownBlock;
    return <Component value={value} schema={schema} path={path} />;
}
