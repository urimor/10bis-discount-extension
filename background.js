chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if(message.type === '10bisDiscountShowIcon'){
		chrome.pageAction.show(sender.tab.id);
		chrome.pageAction.setTitle({
								tabId: sender.tab.id,
								title: `10bis: ${message.discount * 100}% off`
		});
	}
});

