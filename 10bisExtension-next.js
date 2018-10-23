(function () {
    const discountElementClassName = 'MenuTag__MenuTagSubtextStyle-yyq448-2 dSdtqR styled__TagText-sc-1my4kki-17 kypWSc';
    const priceTagsClassName = 'Dishstyled__DishPrice-sc-1lozbs4-3 kAQXPe';

    if (isThereADiscount()) {
        let discount = getDiscount();
        if (typeof discount !== 'undefined') {
            chrome.runtime.sendMessage({
                type: '10bisDiscountShowIcon',
                discount: discount
            });
            updatePrices(discount);
        }
    }

    function isThereADiscount() {
        let discountElements = document.getElementsByClassName(discountElementClassName);
        if (discountElements === undefined) {
            return false;
        }
        let theDiscountElement = discountElements[0];
        if (theDiscountElement === undefined) {
            return false;
        }
        let regExpMatch = theDiscountElement.innerHTML.match(/((\d+.)?\d+)\%/);
        return !(regExpMatch === null || regExpMatch.length < 2);

    }

    function getDiscount() {
        let discountElement = document.getElementsByClassName(discountElementClassName)[0];
        if (discountElement) {
            let discount = discountElement.innerHTML.match(/((\d+.)?\d+)\%/)[1];
            return parseFloat(discount) / 100;
        }
    }

    function updatePrices(discount) {
        let priceElements = document.getElementsByClassName(priceTagsClassName);
        for (let priceElement of priceElements) {
            priceElement.innerHTML = priceElement.innerHTML.replace(/(\d+.\d+) ₪/, (match, price) => {
                let newPrice = getNewPrice(price, discount).toFixed(2);
                let newPriceString = match.replace(/\d+.\d+/, newPrice);
                return `<span class='new-price'>${newPriceString}</span> <span class='old-price'>${match}</span>`;
            });
        }
        const mutationObserver = new MutationObserver(() => {
            if(!isPricesUpdated()){
                updatePrices(discount);
            }
            mutationObserver.disconnect();
        });

        mutationObserver.observe(priceElements[0], {attributes: true, childList: true, subtree: true});
    }

    function isPricesUpdated() {
        const updatedPrices = document.getElementsByClassName("new-price");
        return updatedPrices.length > 0;
    }

    function getNewPrice(oldPrice, discount) {
        return parseFloat(oldPrice) * (1 - discount);
    }
})();