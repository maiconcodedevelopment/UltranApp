import React, { Component } from 'react'
import "./style/index.scss";

import { Button } from '../../buttons/Button';

export  class CardQuery extends Component {
    render() {
        const { title , description , date, time , onClickDelete , onClickUpdate } = this.props  
        return (
            <div {...this.props} className="card" >
                <p className="title" >{title}</p>
                <p className="text" >{description}</p>
                <p className="date" >{date}</p>
                <p className="time" >{time} HR</p>

                <Button icon="delete" onClick={onClickDelete} style={{ width : "auto", height : 25, backgroundColor : "rgb(255, 68, 68)" , marginRight : 10 }}  />
                <Button icon="edit" onClick={onClickUpdate} style={{ width : "auto", height : 25, backgroundColor : "#ffdd44" }}  />
            </div>
        )
    }
}
