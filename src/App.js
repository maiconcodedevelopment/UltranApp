import React from 'react';
import logo from './logo.svg';
import { formatDateObject, getDateFormat } from "./helpers/Date";

import NotificationUltran from "./helpers/Notification";

import "./styles/index.scss"

import { Button } from "./components/buttons/Button";
import { Input } from './components/Inputs/Input';
import { CardQuery } from './components/cards/CardQuery';

import Modal from './components/Modals/Modal';
import socketIO from "socket.io-client";

import InfiniteCalendar from 'react-infinite-calendar';
import TimeKeeper from "react-timekeeper";
import 'react-infinite-calendar/styles.css'; // only needs to be imported once
import { isNull } from 'util';

// Render the Calendar
var today = new Date();
var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
var time = "12:00" //default

var height = window.innerHeight
// var connection = new W3cwebsocket('ws://127.0.0.1:8000');
var socketURL = "http://localhost:4000"

function notifyMe() {
  if (!("Notification" in window)) {
    alert("Não é Suportado Notificatição para este App");
  }

  else if (Notification.permission === "granted") {
    NotificationUltran("Seja Bem Vindo A Consultas",``)
  }

  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        NotificationUltran("Seja Bem Vindo A Consulta")
      }
    });
  }
}

class App extends React.Component{

  constructor(){
    super()
    this.state = {
      activeModal : false,
      selectDay : {
        id : "",
        type : "save",
        date : getDateFormat(today,"-"),
        time : time,
        title : "",
        description : ""
      },
      items : [],
    }

    notifyMe()

    this.socket  = socketIO(socketURL)
  }

  componentWillMount(){
    const { selectDay , items } = this.state
    this.socket.emit("allConsultation")

    this.socket.on("onAllConsultation",(data) => {
       this.setState({
         items : data
       })
    })

    this.socket.on("onInsertConsultation",(data)=>{
      this.state.items.push(data)
      this.setState({
        items : this.state.items,
        selectDay : {
          ...selectDay,
          date : getDateFormat(today,"-"),
          title : "",
          description : ""
        },
      },() => {
         NotificationUltran("Inserido Nova Consulta",`Consulta Marcada para o dia ${data.date}`)
      })
    })

    this.socket.on("onUpdateConsultation",(data) => {
      let consultationUpdate = this.state.items.filter(item => item.id === data.id)
      if(consultationUpdate.length > 0){
        let newItems = this.state.items.map(item => item.id === data.id ? data : item )
        this.setState({
          items : newItems
        },() => {
          NotificationUltran("Atualizado a Consulta",`Para o dia ${data.date}`)
        })
      }
    })

    this.socket.on("onDeleteConsultation",(data) => {
      this.setState({
        items : this.state.items.filter(item => item.id !== data.id )
      },() => {
        NotificationUltran("Deletado a Consulta",`Dia Deletado`)
      })
    })
  }

  emitInfoToall = () => {
  }

  onOpenModal = () => {
    this.setState({
      activeModal : !this.state.activeModal
    })
  }

  handleChange = (date) => {
    const { selectDay } = this.props
    let newDate = getDateFormat(new Date(date),"-")
    this.setState({
      selectDay : {
        ...selectDay,
        id : "",
        type : "save",
        date : newDate,
        time : time,
        title : "",
        description : "",
      }
    })
    console.log(new Date(date).getDate())
  }

  handleTimeChange = (newTime) => {
    console.log(newTime)
    const { selectDay } = this.state
    this.setState({
      selectDay : {
        ...selectDay,
        time : newTime.formatted24
      }
    })
  }

  handleSave = (item) => {
     console.log(item)
  }

  onChange = (key,value) => {
    this.setState({
      selectDay : {
        ...this.state.selectDay,
        [key] : value
      }
    })
  }

  onEdit = (item) => {
     const {  selectDay } = this.state
     this.setState({
       selectDay : {
         ...selectDay,
         id : item.id,
         type : "edit",
         title : item.title,
         description : item.description,
         date : item.date
       }
     },() => {
       this.onOpenModal()
     })
  }

  

  onSave = (event) => {
    const { selectDay } = this.state
    console.log(this.state)
    var data = { id : selectDay.id , date : selectDay.date , title: selectDay.title , description : selectDay.description ,  time : selectDay.time }
    if(!selectDay.title == "" && !selectDay.description == "" && selectDay.type == "save" ){
       
       this.socket.emit("insertConsultation",data)

       this.state.items.push(data)
       this.setState({
         items : this.state.items,
         selectDay : {
           ...selectDay,
           date : getDateFormat(today,"-"),
           title : "",
           description : ""
         },
       },() => {
        this.onOpenModal()
      })
    }

    if(!selectDay.title == "" && !selectDay.description == "" && selectDay.type == "edit" ){
      this.socket.emit("updateConsultation",data)
      
      let consultationUpdate = this.state.items.filter(item => item.id === data.id)
      if(consultationUpdate.length > 0){
        let newItems = this.state.items.map(item => item.id === data.id ? data : item )
        this.setState({
          items : newItems
        },() => {
          this.onOpenModal()
        })
      }
    }
    
  }

  onDelete = (item) => {
    this.socket.emit("deleteConsultation",{ id : item.id })
    this.setState({
      items : this.state.items.filter(consultation => consultation.id !== item.id )
    })
  }

   render(){
     const { selectDay , items , time , activeModal } = this.state
    return (
       <div className="container">
        <InfiniteCalendar
            width={400}
            height={500}
            selected={today}
            disabledDays={[-1,7]}
            minDate={lastWeek}
            onSelect={this.handleChange}
          />
          <div className="content" >
             <div className="content__header" >
               <div>
                 <h2 className="title__day" >{selectDay.date}</h2>
               </div>
                 <Button title="Salvar Consulta" onClick={this.onOpenModal} />
             </div>
             <div className="content__body" >
               <div className="content__body__list" style={{ height : 550 }} >
                  {
                    items.map((item,index) => {
                      return (
                        <CardQuery onClickUpdate={() => { this.onEdit(item); }} onClickDelete={ () => { this.onDelete(item) } }  key={index} title={item.title} description={item.description} date={item.date} time={item.time} />
                      )
                    })
                  }
               </div>
             </div>
          </div>
          <Modal active={activeModal} >
              <Input placeholder="Titulo" value={selectDay.title} onChange={(event) => { this.onChange("title",event.target.value) } } />
              <Input placeholder="Descrição" value={selectDay.description} onChange={(event) => { this.onChange("description",event.target.value) } } />
              <div className="modal__time" >
                <TimeKeeper
                    time={selectDay.time}
                    onChange={this.handleTimeChange}
                />
              </div>
              <div className="modal__buttons" >
                <Button title="Salvar" onClick={this.onSave} style={{ flex : 1 }} />
                <Button title="Calcelar" onClick={this.onOpenModal} style={{ flex : 1 , backgroundColor : "#ff4444" }} />
              </div>
              
          </Modal>
       </div>
    );
   }
}


export default App;
