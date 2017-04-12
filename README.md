# Implementation of Model-View-Controller in JavaScript, in browser

This is my project from 2005. It was done way before the current widespread of MVC JavaScript libraries.

These days there is no practical value in it, so it's here for archaeological purposes.

## The idea behind that implementation

* Controller holds data models and update view.
* Model object can relate to another model objects by holding it in collections or in attributes.
* Controller object can relate to another controller objects in a similar way.
* Models are singletons.
* One model object may be used in a number of controllers.
* If model is updated, the controller receives event and updates view accordingly.
* The events propagate through related models and through all related controllers.
* Controllers may be selective for the events they receive.

Notable code is in
[relations.js](foam/foam_relations.js) and
[events.js](foam/foam_events.js).

[Other code](foam) is not that interesting.


## Copyright and License

Please see the [LICENSE](LICENSE) file.
