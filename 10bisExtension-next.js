(function () {
    const discountElementSelector = 'p[type=DiscountCoupon]+p';
    const priceTagsClassName = 'MenuDishstyled__DishPrice-sc-61p3f0-3 dQnoFt';

    const mutationsObserver = new MutationObserver((e) => {
        if (isThereADiscount() && !isPricesUpdated()) {
            let discount = getDiscount();
            if (typeof discount !== 'undefined') {
                chrome.runtime.sendMessage({
                    type: '10bisDiscountShowIcon',
                    discount: discount
                });
                updatePrices(discount);
            }
        }
    });
    mutationsObserver.observe(document,{attributes: false, childList: true, subtree: true});

    function isThereADiscount() {
        let discountElement = document.querySelector(discountElementSelector);
        if (discountElement === undefined) {
            return false;
        }
        let regExpMatch = discountElement.innerHTML.match(/((\d+.)?\d+)\%/);
        return !(regExpMatch === null || regExpMatch.length < 2);

    }

    function getDiscount() {
        let discountElement = document.querySelector(discountElementSelector);
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
    }

    function isPricesUpdated() {
        const updatedPrices = document.getElementsByClassName("new-price");
        return updatedPrices.length > 0;
    }

    function getNewPrice(oldPrice, discount) {
        return parseFloat(oldPrice) * (1 - discount);
    }
})();