#sensevers-db

#usage

```js

const setupDatabase = require('senseverse-db')
setupDatabase(config).then(db => {
	const {Agent, Metric} = db
	}).catch(err => console.error(err))
```