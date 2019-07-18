import React, { Component } from 'react'
import MaterialIcon from "material-icons-react"
import "./style/index.scss"

export class Button extends Component {
    render() {
        const { title , icon ,  onKeyPress } = this.props
        return (
            <div {...this.props} className="button" >
                {
                  title ? <p className="title" >{title}</p> : null
                }
                <MaterialIcon icon={icon} />
            </div>
        )
    }
}
