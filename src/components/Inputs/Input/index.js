import React, { Component } from 'react'
import "./style/index.scss";

export  class Input extends Component {
    render() {
        const { placeholder , style } = this.props
        return (
            <input className="input" style={style} {...this.props} placeholder={placeholder} />
        )
    }
}
