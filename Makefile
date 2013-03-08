minify:
	rm -f strftime-min.js
	closure <strftime.js >|strftime-min.js

test:
	TZ=America/Vancouver node test/test.js
	TZ=CET node test/test.js

.PHONY: test
