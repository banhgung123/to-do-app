
import oval from '../../img/oval.svg';
import checkMark from '../../img/check-mark.svg';
import cancel from '../../img/cancel.svg';
import './to-do-item.css';
import React, { Component } from 'react';
import classNames from 'classnames';

class TodoItem extends Component {
    render() {
        let { item, handleItemTick, handleItemCancel, edit} = this.props;
        let url = oval;
        if(item.completed === true) url = checkMark;
        return (
            <div className="view">
                <li className={classNames({'editing': edit})}>
                    { edit === false && <img
                        className={classNames({'show': item.completed === false})}
                        src={url} 
                        width={32}
                        onClick={handleItemTick}/> }
                    { edit === false && <label
                        className={classNames({'todo-completed': item.completed === true})}>
                        {item.title}
                    </label>}
                    { edit === true && <input
                        type="text"
                        className={classNames({'invisible': !edit})}
                        value={item.title}/>} 
                    { edit === false && <img
                        className="cancel"
                        src={cancel} width={16}
                        onClick={handleItemCancel}/> }
                </li>
                
            </div>
        );
    }
}

export default TodoItem;