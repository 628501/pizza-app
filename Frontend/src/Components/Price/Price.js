import React from 'react'

const Price = ({price, locale, currency}) => {

const formatPrice = () => 
    new Intl.NumberFormat(locale, {
        style : 'currency',
        currency,
    }).format(price);


  return (
    <div>
      <span>{formatPrice()}</span>
    </div>
  )
}

export default Price
 

Price.defaultProps = {
    locale: "en-IN",
    currency: "INR",
}