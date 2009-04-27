/* 
# Copyright (c) 2005-2007 Stanislav Senotrusov <senotrusov@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Создать класс контроллера
foam.controller.define = function (def){

  def.conf = Object.deep_extend ({
    mixin: ['relations', 'events', 'generic', 'view', 'inspect_generic', 'inspect'],
    catch_events: [],
    placeholder: {tag: 'span', style:'', onclick:''},
  }, def.conf || {})

  if (!def.initialize) def.initialize = function(){} // to prevent double execution of last mixined initialize
  def.class_name = def.name

  var created = this[def.name] = Class.create_mixable()
  
  for (var i=0; i<def.conf.mixin.length; ++i)
    if (!foam.controller[ def.conf.mixin[i] ])
      alert('~Controller #{def.conf.mixin[i]} not found while tryint to mix it in #{def.name}~')
    else
      Object.deep_extend (created.prototype, foam.controller[ def.conf.mixin[i] ].prototype)


  created.prototype.conf = Object.deep_extend (created.prototype.conf || {}, def.conf)
  delete def.conf

  Object.extend(created.prototype, def)  
}