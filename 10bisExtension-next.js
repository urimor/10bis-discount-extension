(function () {
    const discountElementSelector = '.DiscountTag__DiscountText-sc-1nsisq8-1';
    const priceTagsClassName = '.PriceLabel__Root-tydi84-0>div';

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
    mutationsObserver.observe(document.querySelector('body'),{attributes: false, childList: true, subtree: false});

    function isThereADiscount() {
        let discountElement = document.querySelector(discountElementSelector);
        if (discountElement === undefined || discountElement === null) {
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
        let priceElements = document.querySelectorAll(priceTagsClassName);
        for (let priceElement of priceElements) {
            priceElement.innerHTML = priceElement.innerText.replace(/₪(\d+.\d+)/, (match, price) => {
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