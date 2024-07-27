import React from 'react';


const DateTime = ({date,
    options:{ weekday, year, month, day, hour, minute, second},
}) => {

  var currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

  const getDate = () => 
    new Intl.DateTimeFormat(currentLocale, {
      year,
      month,
      day,
      hour,
      weekday,
      minute,
      second,
    }).format(Date.parse(date));
  
  return (
    <>
     {getDate()}
    </>
  )
}

export default DateTime

DateTime.defaultProps = {
  options:{
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
}

