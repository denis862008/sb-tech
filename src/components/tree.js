import React from 'react';
import axios from 'axios';
import Node from './node';
import './styles.css';

class Tree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: null
        };
    }
    componentWillMount() {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/rest/groups.json'
        }).then(resp => {
            const items = resp.data;

            items.map(item => {
                const childProps = this.countChildren({ items, item });
                item.level = this.setLevel({ items, item });
                item.childCount = childProps.count;
                item.childrenIDs = childProps.ids;

                if (item.childCount) item.hidden = true;
            });

            this.setState({ items });

        }).catch(e => {
            console.error('error: ', e);
        });
    }
    countChildren(params) {
        const { items, item } = params;
        const filtered = items.filter(itm => {
            if (itm.hasOwnProperty('parent')) {
                return item.id === itm.parent.id;
            }
        });
        const IDs = [];

        if (filtered.length) {
            filtered.map(filterItem => {
                IDs.push(filterItem.id);
            });
        }

        return {
            ids: IDs,
            count: filtered.length
        };
    }
    setLevel(params) {
        let level = 0;
        const { items } = params;
        let { item, item: { parent } } = params;

        if (typeof parent === 'undefined') return level;

        while (typeof parent !== 'undefined') {
            if (item.hasOwnProperty('level')) {
                level = item.level + 1;
                break;
            } else {
                const idx = items.findIndex(itm => parent.id === itm.id);
                item = items[idx];
                parent = item.parent;
            }

            level++;
        }

        return level;
    }
    handleRowClick(target) {
        const { items } = this.state;
        const id = target.id;
        const itemIdx = items.findIndex(itm => itm.id === id);
        const { hidden, childrenIDs } = items[itemIdx];

        if (typeof hidden !== 'undefined') {
            items[itemIdx].hidden = !hidden;

            if (childrenIDs.length) this.recursiveClosure(items[itemIdx]);
        }
        this.setState({ items });
    }
    recursiveClosure(item) {
        const { items } = this.state;
        const { childrenIDs } = item;

        childrenIDs.map(childID => {
            const childIdx = items.findIndex(itm => itm.id === childID);
            const hasHidden = items[childIdx].hasOwnProperty('hidden');

            if (hasHidden && items[childIdx].hidden === false) {
                items[childIdx].hidden = !items[childIdx].hidden;
                if (items[childIdx].childrenIDs.length) this.recursiveClosure(items[childIdx]);
            }
        });
    }
    renderTree() {
        const { items } = this.state;
        const itemsVisible = [];

        let groupByLevel = items.reduce((acc, currentItem) => {
            const { level, parent, hidden } = currentItem;

            if (!acc[level]) acc[level] = [];
            if (level === 0 && typeof parent === 'undefined') {
                acc[level].push(currentItem);
            }
            if (hidden === false) {
                currentItem.childrenIDs.map(childID => {
                    const childIdx = items.findIndex(itm => itm.id === childID);
                    const childLevel = items[childIdx].level;

                    if (!acc[childLevel]) acc[childLevel] = [];
                    acc[childLevel].push(items[childIdx]);
                });
            }

            return acc;
        }, {});

        groupByLevel = Object.getOwnPropertyNames(groupByLevel).map(k => groupByLevel[k]);
        groupByLevel.map((level, levelIdx) => {
            level.map(node => {
                if (levelIdx === 0) {
                    itemsVisible.push(
                        <Node
                            onClick={this.handleRowClick.bind(this)}
                            key={node.id} {...node}
                        />
                    );
                }

                if (levelIdx !== 0 && level.length) {
                    let { id, parent: {id: parentId } } = node;
                    const parentIdx = itemsVisible.findIndex(itm => itm.props.id === parentId) + 1;
                    const reactNode = <Node
                        onClick={this.handleRowClick.bind(this)}
                        key={id} {...node}
                    />;

                    itemsVisible.splice(parentIdx, 0, reactNode);
                }
            });
        });

        return itemsVisible;
    }
    render() {
        const { items } = this.state;

        return (
            <div className='container'>
                <div className='row row_header'>
                    <div className='col-xs-6'>Group Name</div>
                    <div className='col-xs-2'>ID</div>
                    <div className='col-xs-2'>Permission</div>
                    <div className='col-xs-2'>Priority</div>
                </div>
                { items ? this.renderTree() : null }
            </div>
        );
    }
}

export default Tree;
