# Implementation of Model-View-Controller in JavaScript, in browser

I don't think it has any practical value these days, in the precence of many MVC JavaScript libraries,
but that's my project from 2005 and the presence of it makes me an early adopter of some sort.

Anyway it's here for archaeological purposes.

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
[relations.js](https://github.com/senotrusov/foam/blob/master/foam/foam_relations.js) and
[events.js](https://github.com/senotrusov/foam/blob/master/foam/foam_events.js).

[Other code](https://github.com/senotrusov/foam/tree/master/foam) is not quite interesting.


## Copyright and License

Copyright (c) 2005-2007 Stanislav Senotrusov \<senotrusov@gmail.com\>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
