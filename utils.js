function calculateOrderAmount(itemsArray){
  const total = itemsArray.reduce((acc, item) => {
    return acc + item.price;
  }, 0);
  return Math.floor(total);
}

module.exports = { calculateOrderAmount }

  // item_id: number,
  // product_id: number,
  // name: string,
  // brand: string,
  // size: string,
  // color: string,
  // quantity: number
  // url: string,
  // price: number