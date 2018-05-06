import React from 'react';
import PropTypes from 'prop-types';

class Node extends React.Component {
    handleClick(event) {
        event.preventDefault();

        let { target } = event;

        while (!target.classList.contains('row_data-row')) {
            target = target.parentNode;
        }

        this.props.onClick(target);
    }
    rowNode(hidden) {
        if (typeof hidden !== 'undefined') {
            if (hidden === true) return 'row_node row_node-close';
            return 'row_node row_node-open';
        }

        return '';
    }
    render () {
        const { id, name, permission, priority, level, hidden } = this.props;

        return (
            <div
                className={`row row_data-row row_level-${level} ${this.rowNode(hidden)}`}
                onClick={this.handleClick.bind(this)}
                id={id}
            >
                <div className='col-xs-6'><span className='name'>{ name }</span></div>
                <div className='col-xs-2'>{ id }</div>
                <div className='col-xs-2'>{ permission }</div>
                <div className='col-xs-2'>{ priority }</div>
            </div>
        );
    }
}

Node.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    permission: PropTypes.string,
    priority: PropTypes.string,
    level: PropTypes.number,
    onClick: PropTypes.func.isRequired,
    hidden: PropTypes.bool
};

export default Node;
