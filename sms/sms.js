// Author: Peter Širka / Total Avengers
// Web: https://www.totaljs.com
// License: MIT

// Usage:
// OPERATION('sms', { key: 'YOUR_NEXMO_KEY', secret: 'YOUR_NEXMO_SECRET', to: 'PHONE_NUMBER', from: 'STRING_or_PHONE_NUMBER', text: 'TEXT TO SMS' }, console.log)

// Possible output:
// { success: true, value: { to: '421903163302', 'message-id': '--------', status: '0', 'remaining-balance': '7.58840000', 'message-price': '0.07360000', network: '23102' }

NEWOPERATION('sms', function($) {
	var value = $.value;
	RESTBuilder.POST('https://rest.nexmo.com/sms/json', { api_key: value.key, api_secret: value.secret, to: value.to, from: value.from, text: value.text }).exec(function(err, response) {
		if (response) {
			var item = response.messages ? response.messages[0] : null;
			if (item) {
				if (item['error-text'])
					$.invalid(item['error-text']);
				else if (item.to)
					$.success(true, item);
			} else
				$.success(false);
		} else
			$.invalid(err);
	});
});