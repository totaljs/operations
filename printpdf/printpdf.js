// Author: Peter Širka / Total Avengers
// Web: https://www.totaljs.com
// License: MIT

// Usage in routes:
// ROUTE('GET /api/print/    * --> @printpdf', [10000]);

NEWOPERATION('printpdf', function($) {

	// $.query.url {String} Absolute URL address
	// $.query.name {String} Name of PDF file without file extension

	var spawn = require('child_process').spawn('/bin/bash', ['-c', 'wkhtmltopdf --quiet --page-size "letter" "{0}" - | cat ; exit ${PIPESTATUS[0]}'.format($.query.url)]);
	$.res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="{0}.pdf"'.format(encodeURIComponent($.query.name || 'output.pdf')) });
	spawn.stdout.pipe($.res);

});