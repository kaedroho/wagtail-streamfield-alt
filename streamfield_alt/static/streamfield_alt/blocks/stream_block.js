import * as React from 'react';

import {renderBlock} from '.';


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

            let onClick = e => {
                this.props.onAddItem(choice);

                this.state.isOpen = false;
                this.setState(this.state);

                e.preventDefault();
                return false;
            }

            choices.push(
                <li key={choice}>
                    <button type="button" className="action-add-block-h2 icon icon-title" onClick={onClick}><span>{schema.label}</span> </button>
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
        let actionButtons = [];

        if (!this.props.isFirst) {
            actionButtons.push(<button key="moveup" type="button" id={`${this.props.path}-moveup`} title="Move up" className="icon text-replace icon-order-up">Move up</button>);
        }

        if (!this.props.isLast) {
            actionButtons.push(<button key='movedown' type="button" id={`${this.props.path}-movedown`} title="Move down" className="icon text-replace icon-order-down">Move down</button>);
        }

        actionButtons.push(<button key='delete' type="button" id={`${this.props.path}-delete`} title="Delete" className="icon text-replace hover-no icon-bin">Delete</button>);


        return <li id={`${this.props.path}-container`} className={`sequence-member blockname-${this.props.type}`}>
            <div className="sequence-controls">
                <h3><label for={`${this.props.path}-value`}>{this.props.schema.label}</label></h3>
                <div className="button-group button-group-square">
                    {actionButtons}
                </div>
            </div>
            <div className="sequence-member-inner ">
                {renderBlock(this.props.value, this.props.schema, this.props.path)}
            </div>
            <StreamMenu id={`${this.props.path}-appendmenu`} schema={this.props.parentSchema} onAddItem={this.props.onAddItem} />
        </li>;
    }
}

export class StreamBlock extends React.Component {
    addChildBlock(position, type) {
        // TODO
    }

    render() {
        let childBlocks = [];

        for (let id in this.props.value) {
            let path = `${this.props.path}-${id}`;
            let type = this.props.value[id].type;
            let value = this.props.value[id].value;
            let schema = this.props.schema.child_blocks[type];
            let isFirst = id == 0;
            let isLast = id ==this.props.value.length - 1;

            childBlocks.push(<StreamChild key={id} path={path} type={type} value={value} schema={schema} parentSchema={this.props.schema} onAddItem={type => this.addChildBlock(type, parseInt(id) + 1)} isFirst={isFirst} isLast={isLast} />);
        }

        return <div className="field block_field block_widget ">
            <div className="field-content">
                <div className="input  ">
                    <div className="sequence-container sequence-type-stream">
                        <StreamMenu id={`${this.props.path}-prependmenu`} schema={this.props.schema} onAddItem={type => this.addChildBlock(type, 0)} />

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
