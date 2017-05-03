if(isThereADiscount()){
	let discount = getDiscount();
	if(typeof discount !== 'undefined') {
		chrome.runtime.sendMessage({
			type:'10bisDiscountShowIcon',
			discount: discount
		});
		updatePrices(discount);
	}
}

function isThereADiscount() {
	let discountDivs = document.getElementsByClassName('discountCouponImgHeaderRed SpecialDiscountPercent');
	if(typeof discountDivs === 'undefined'){
		return false;
	}
	let theDiscountDiv = discountDivs[0];
	if(typeof theDiscountDiv === 'undefined'){
		return false;
	}
	let regExpMatch = theDiscountDiv.innerHTML.match(/(\d+)\%/);
	if(regExpMatch === null || regExpMatch.length < 2){
		return false;
	}
	return true;
}

function getDiscount() {
	let discountDiv = document.getElementsByClassName('discountCouponImgHeaderRed SpecialDiscountPercent')[0];
	if(discountDiv){
		let discount = discountDiv.innerHTML.match(/(\d+)\%/)[1];
		return parseInt(discount)/100;
	}
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
