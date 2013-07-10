### Implementation of Model-View-Controller in JavaScript, in browser

I don't think it has any practical value these days, in the precence of many MVC JavaScript libraries,
but that's my project from 2005 and the presence of it makes me an early adopter of some sort.

Anyway it's here for archaeological purposes.

### The idea behind that implementation

* Controller holds data models and update view.
* Model object can relate to another model objects by holding it in collections or in attributes.
* Controller object can relate to another controller objects in a similar way.
* Models are singletons.
* One model object may be used in a number of controllers.
* If model is updated, the controller receives event and updates view accordingly.
* The events propagate through related models and through all related controllers.
* Controllers may be selective for the events they receive.

Notable code is in
[relations.js](https://github.com/senotrusov/foam/blob/master/foam/foam_relations.js) and 
[events.js](https://github.com/senotrusov/foam/blob/master/foam/foam_events.js).

[Other code](https://github.com/senotrusov/foam/tree/master/foam) is not quite interesting.
