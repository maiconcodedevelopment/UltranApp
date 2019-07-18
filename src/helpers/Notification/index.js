import ultan from "../../img/icons/altran.png"

export default function(title,text){
    new Notification(title, { body: text, icon: ultan });
}