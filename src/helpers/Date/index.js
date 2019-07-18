let validadeMonth = new RegExp(/\d{2}/g)

function formatNumberThow (value){
    return validadeMonth.test(value) ? value : `0${value}`
}

export var getDateFormat = function(date,typeseparator) {
    let dateString =  [date.getFullYear(),formatNumberThow(date.getMonth()),formatNumberThow(date.getDate()) ].join(typeseparator)
    return new RegExp(/\d{4}-\d{2}-\d{2}/g).test(dateString) ? dateString : ""
}

export var formatDateObject = function(date){
    return [date.year, formatNumberThow(date.month) , formatNumberThow(date.day)].join("-")
}