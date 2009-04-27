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

foam.model.ajax = Class.create_mixable ({

  load:   function (){ this.do_request ('load', arguments, false, false) },
  reload: function (){ this.do_request ('load', arguments, false, true)  },
  save:   function (){ this.do_request ('save', arguments, this,  true)  },

  do_request: function (method, arguments, data, reload){
    var req = (typeof (arguments = Array.from(arguments))[0] == 'object') ? arguments.shift() : {}
    req.arguments && (arguments = req.arguments)
    var context = Object.extend(arguments, req)
    
    this.request({
      controller: req.controller || this.conf.controller,
      method_prefix: req.method_prefix || (this.conf.method_prefix == true) ? this.conf.name : this.conf.method_prefix,
      method: req.method || method,
      argv: arguments,
      context: context,
      data: data,
      cache: this.conf.cache,
      reload: reload })
    
    this.conf.transfer_state = method + 'ing'
    },
    
  request: function(req){
    var This           = this

    var url            = ((req.controller) ? application_path+req.controller+'/' : controller_path) + ((req.method_prefix==false)?'':req.method_prefix+'_')+req.method+'/' + req.argv.join('/')
    var method         = req.method
    var cache          = (req.cache) ? foam.cache : false
    var context        = req.context || req.argv

    if (cache && cache[url] && !req.reload){
      This['on_' + method] &&
      This['on_' + method](cache[url], context)
    } else {
      new Ajax.Request(url, {
        method: 'post',
        postBody: ((req.data) ? this.export_data(req.data) : false),
        
        onSuccess: function(response, json) {
          
          try { eval('var json ='+response.responseText) } catch (ex) { log_exception(ex); }
          
          This['on_' + method] &&
          This['on_' + method](json, context)
          
          cache && (cache[url] = json)
        },
        
        onFailure: function(response) {
          $('debug').innerHTML = response.status.toString() + ' ' + response.statusText + '<br>' + response.responseText;
        }
      })
    }
  },

  on_load: function (data, context){
    
    if( data.data && data.directory ){
      Object.extend(foam.directory, data.directory);
      data = data.data
    }
    
    foam.locks.importing_data_from_storage = true
    
    this.import_data(data)
    
    foam.locks.importing_data_from_storage = false
    
    this.conf.transfer_state = 'loaded'
    this.fire_event ({name: 'loaded'})
  },
  
  on_save: function (data, context){
    this.conf.transfer_state = 'saved'
    this.fire_event ({name: 'saved'})
  },


  import_data: function(data){

    var existed = foam.factory.get_existing(data.class, data.id)

    if(data.class && data.id && existed && existed != this){
      this.set(existed)
      existed.import_data(data)
    }

    for (var i in this)
      if (i != 'conf' && typeof(this[i]) != 'function')
        this.remove(i)

    for (var i in data){
      if (i != 'class' && i != 'create_from_foam_factory' && i != 'conf' && typeof(this[i]) != 'function'){
        if (typeof(data[i]) == 'object') {
          
          this.set ((parseInt(i).toString() == i) ? parseInt(i) : i, foam.factory.find_or_create(data[i].class, data[i].id))
          this[(parseInt(i).toString() == i) ? parseInt(i) : i].import_data (data[i])

        } else {
          this.set (i, data[i])
        }
      }
    }
  },


  export_data: function(obj){
    return "data=" + encodeURIComponent (this.dump_object(obj))
  }, 
  
  
  dump_object: function(obj, name){
    var json
    name = name ? name + ': ' : ''

    switch (typeof(obj)){
       case 'string':
          return name + obj.to_json()
    
       case "undefined":
          return name
    
       case "boolean":
       case "number":
          return name + obj
    
       default:
        if ((json = this.dump_compound_object(obj)) != undefined) {
          return name + json
        } else {
          return undefined
        }
    }
  },
  
  dump_compound_object: function(obj){
    var items = []

    if (obj.conf.name == 'array' && obj.length != undefined){
      for (var i = 0; i < obj.length; i++) items.push_if_defined (this.dump_object(obj[i]))

    } else {

      for (var i in obj){
        if (foam.model.is_instance(obj[i]) && obj[i].value != undefined){ // value object case
          items.push_if_defined (this.dump_object(obj[i].value, i))
          obj[i].conf.changed = false
          
        } else if (typeof(obj[i]) != 'function' && !(obj.conf.dont_export[i])){
          items.push_if_defined (this.dump_object(obj[i], i))
        }
      }

      if(obj.conf.deleted) items.push (this.dump_object (true, 'deleted'))
      if(obj.conf.removed) items.push (this.dump_object (true, 'removed'))
    }
    
    obj.conf.changed = false
    
    if (obj.conf.name == 'array') {
      return '~[#{items.join(', ')}]~'

    } else {
      if (items.length == 0) return undefined
    
      items.unshift('~class: "#{obj.conf.name}"~')
    
      return '~{#{items.join(', ')}}~'
    }
  }
})
