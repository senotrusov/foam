 
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

class FoamFoamInclude < FoamInclude
  defaults      :prototype, :toolkit, :foam
  
  defaults_for  :prototype => [:prototype],
                :scriptaculous => [:builder, :effects, :dragdrop, :controls, :slider],
                :foam => [
                          # foam base libs
                          :foam_structure,
                          :foam_relations,
                          :foam_events,
                          :foam_console,
                          :foam_inspect,
                          
                          # generic model libs
                          :model_define,
                          :foam_factory,
                          :model_generic,
                          :model_ajax,
                          :model_inspect,
                          :model_array,
                          :model_dummy,
                          
                          # generic controller libs
                          :controller_define,
                          :controller_generic,
                          :controller_view,
                          :controller_helpers,
                          :controller_helpers_mixin,
                          :controller_inspect
                         ],
                :toolkit => [:toolbox, :date, :taskPool]
end
