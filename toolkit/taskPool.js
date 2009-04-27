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

var task_pool = Class.create_mixable();

task_pool.prototype = {
  initialize: function(){
    this.pool = new Object
    this.single_flag = new Object
    this.next_id = 0
  },

  add: function(task){
    this.pool[this.next_id] = task
    return this.next_id++
  },

  add_single: function(task){
    this.single_flag[this.next_id] = true
    return this.add(task)
  },

  remove: function(id){
    delete this.pool[id]
    delete this.single_flag[id]
  },

  proceed: function(){
    if(this.flag_ignore_click){this.flag_ignore_click=false; return;}

    for(var i in this.pool){
      this.pool[i]()

      if(this.single_flag[i])
        this.remove(i)
    }
  },

  ignore_click: function(){
    this.flag_ignore_click=true;
  }
}
