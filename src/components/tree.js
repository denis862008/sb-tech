import React from 'react';
import axios from 'axios';
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
                item.hidden = item.level !== 0;
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
    handleRowClick(event) {
        event.preventDefault();

        const { items } = this.state;
        let { target } = event;

        while (!target.classList.contains('row_data-row')) {
            target = target.parentNode;
        }

        const id = target.id;
        const itemIdx = items.findIndex(itm => itm.id === id);

        if (items[itemIdx].childrenIDs.length) {
            items[itemIdx].childrenIDs.map(childId => {
                const childIdx = items.findIndex(subItm => subItm.id === childId);
                items[childIdx].hidden = !items[childIdx].hidden;
            });

            this.setState({ items });
        }
    }
    renderTree(item) {
        if (!item.hidden) {
            return (
                <div
                    key={item.id}
                    className={`row row_data-row row_level-${item.level}`}
                    onClick={this.handleRowClick.bind(this)}
                    id={item.id}
                >
                    <div className='col-xs-6'><span className='name'>{ item.name }</span></div>
                    <div className='col-xs-2'>{ item.id }</div>
                    <div className='col-xs-2'>{ item.permission }</div>
                    <div className='col-xs-2'>{ item.priority }</div>
                </div>
            );
        }
    }
    render() {
        const { items } = this.state;

        console.log(items);
        return(
            <div className='container'>
                <div className='row row_header'>
                    <div className='col-xs-6'>Group Name</div>
                    <div className='col-xs-2'>ID</div>
                    <div className='col-xs-2'>Permission</div>
                    <div className='col-xs-2'>Priority</div>
                </div>
                { items ? items.map(this.renderTree.bind(this)) : null }
            </div>
        );
    }
}

export default Tree;
