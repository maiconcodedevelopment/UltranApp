import React, { Component } from 'react'
import "./style/index.scss"

export default class Modal extends Component {
    render() {
        const { children , active } = this.props
        return (
            <div className={`modal ${active ? "modal-animation" : null }`} >
                <div className="modal__content" >
                    {children}
                </div>        
            </div>
        )
    }
}
