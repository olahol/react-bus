# react-bus

An event emitter designed for communication between react components.

[![browser support](https://ci.testling.com/olahol/react-bus.png)
](https://ci.testling.com/olahol/react-bus)

## Example

```js
var bus = new ReactBus();

bus.on("_drop", function (e) {
  console.log("you dropped", e);
});

bus.emit("test");
// you dropped test
```

## Methods

### ReactBus.prototype.on

* * *

### ReactBus.prototype.once

* * *

### ReactBus.prototype.off

* * *

### ReactBus.prototype.emit

* * *

### ReactBus.prototype.handle

## License

MIT
