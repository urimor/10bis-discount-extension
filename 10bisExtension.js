let discount = getDiscount();
if(discount > 0) {
	chrome.runtime.sendMessage({
		type:'10bisDiscountShowIcon',
		discount: discount
	});
	updatePrices(discount);
}

function getDiscount() {
	let discountDiv = document.getElementsByClassName('discountCouponImgHeaderRed SpecialDiscountPercent')[0];
	if(discountDiv){
		let discount = discountDiv.innerHTML.match(/(\d+)\%/)[1];
		return parseInt(discount)/100;
	}
	return 0;
}

function updatePrices(discount) {
	let priceDivs = document.getElementsByClassName('dishPriceDiv');
	for(let priceDiv of priceDivs) {
		priceDiv.innerHTML = priceDiv.innerHTML.replace(/₪ (\d+.\d+)/,(match, price) => {
			let newPrice = getNewPrice(price,discount).toFixed(2);
			let newPriceString = match.replace(/\d+.\d+/,newPrice);
			return `<span class='new-price'>${newPriceString}</span> <span class='old-price'>${match}</span>`;
		});
	};
}

function getNewPrice(oldPrice, discount) {
	return parseFloat(oldPrice) * (1 - discount);
}
