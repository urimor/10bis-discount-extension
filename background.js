chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if(message.type === '10bisDiscountShowIcon'){
		chrome.pageAction.show(sender.tab.id);
	}
});

