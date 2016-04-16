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
        return <div className={this.getClassNames().join(' ')} id={this.props.id}>
            <a className="toggle" onClick={e => this.onToggle(e)}><span>Insert block</span></a>
            <div style={{height: 0}} className="stream-menu-inner">
                <ul>
                    <li>
                        <button type="button" className="action-add-block-h2 icon icon-title"><span>H2</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-h3 icon icon-title"><span>H3</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-h4 icon icon-title"><span>H4</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-intro icon icon-pilcrow"><span>Intro</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-paragraph icon icon-pilcrow"><span>Paragraph</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-aligned_image icon icon-image"><span>Aligned image</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-pullquote icon icon-openquote"><span>Pullquote</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-aligned_html icon icon-code"><span>Raw HTML</span> </button>
                    </li>
                    <li>
                        <button type="button" className="action-add-block-document icon icon-doc-full-inverse"><span>Document</span> </button>
                    </li>
                </ul>
            </div>
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

            childBlocks.push(<StreamChild key={id} path={path} type={type} value={value} schema={schema} parentSchema={this.props.schama} />);
        }

        return <div className="field block_field block_widget ">
            <div className="field-content">
                <div className="input  ">
                    <div className="sequence-container sequence-type-stream">
                        <StreamMenu id="body-prependmenu" schema={this.props.schema} />

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

class RichTextBlock extends React.Component {
    render() {
        return <div className="field char_field widget-rich_text_area fieldname-paragraph">
            <div className="field-content">
                <div className="input">
                    <textarea cols="40" id={`${this.props.path}-value`} name={`${this.props.path}-value`} placeholder="Paragraph" rows="10">{this.props.value}</textarea>
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        makeRichTextEditable(`${this.props.path}-value`);
    }
}


let BLOCK_TYPES_REGISTRY = {
    'wagtail.core.StreamBlock': StreamBlock,
    'wagtail.core.StructBlock': StructBlock,
    'wagtail.core.RichTextBlock': RichTextBlock,
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
