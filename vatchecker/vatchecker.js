// Author: Peter Širka / Total Avengers
// Web: https://www.totaljs.com
// License: MIT

// Usage in routing
// ROUTE('GET  /api/vat/  * --> @vatchecker');

NEWOPERATION('vatchecker', function($) {

	// $.value {String} or $.query.vat

	var value = $.value || ($.query ? $.query.vat : '');

	RESTBuilder.make(function(builder) {
		builder.url('http://ec.europa.eu/taxation_customs/vies/services/checkVatService');
		builder.xml('<?xml version="1.0" encoding="UTF-8" standalone="no"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:impl="urn:ec.europa.eu:taxud:vies:services:checkVat" xmlns:apachesoap="http://xml.apache.org/xml-soap" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsdlsoap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ><SOAP-ENV:Body><tns1:checkVat xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat:types"><tns1:countryCode>{0}</tns1:countryCode><tns1:vatNumber>{1}</tns1:vatNumber></tns1:checkVat></SOAP-ENV:Body></SOAP-ENV:Envelope>'.format(value.substring(0, 2), value.substring(2)));
		builder.exec(function(err, response) {

			if (err)
				$.invalid(err);
			else
				$.callback(response['soap:Envelope.soap:Body.checkVatResponse.valid'] === 'true');

			// company: response['soap:Envelope.soap:Body.checkVatResponse.name'];
			// address: response['soap:Envelope.soap:Body.checkVatResponse.address'];
		});
	});
});