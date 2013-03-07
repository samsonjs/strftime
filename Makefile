test:
	TZ=America/Vancouver node test/test.js
	TZ=CET node test/test.js

.PHONY: test
