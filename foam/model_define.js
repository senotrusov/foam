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

// Создать класс модели
foam.model.define = function (def){

  def.conf = Object.deep_extend ({
    name: 'dummy',
    controller: false,
    method_prefix: true,
    mixin: ['relations', 'events', 'generic', 'ajax', 'inspect_generic', 'inspect'],
    cache: true,
    changed: false,
    transfer_state: undefined,
    deleted: false,
    removed: false,
    serial: undefined,
    dont_export: {conf: true},
    assume_changes: {},
    catch_events: [],
    parents: []
  }, def.conf || {})

  if (!def.initialize) def.initialize = function(){} // to prevent double execution of last mixined initialize

  var created = this[def.conf.name] = Class.create_mixable()
  
  for (var i=0; i<def.conf.mixin.length; ++i)
    if (!foam.model[ def.conf.mixin[i] ])
      alert('~Model #{def.conf.mixin[i]} not found while tryint to mix it in #{def.conf.name}~')
    else
      Object.deep_extend (created.prototype, foam.model[ def.conf.mixin[i] ].prototype)


  created.prototype.conf = Object.deep_extend (created.prototype.conf || {}, def.conf)
  delete def.conf

  Object.extend(created.prototype, def)
}
