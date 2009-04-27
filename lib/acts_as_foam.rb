
# Copyright (c) 2007 Stanislav Senotrusov <senotrusov@gmail.com>
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

module ActsAsFoam
  module BaseClassMethods
    def acts_as_foam args = {}
      extend  ActsAsFoam::ClassMethods
      include ActsAsFoam::InstanceMethods
    end
  end
  
  module InstanceMethods
    attr_accessor :controller
    def foam_permit?(action, controller)
      self.class.foam_permit?(action, controller, record = self)
    end
  end
  
  module ClassMethods
    # foam_permit :for => "editor of Record or editor of :record or superuser", :read => [], :access => [], :do => [:create, :delete], 

    def foam_permit attrs
      @foam_permit ||= []
      @foam_permit << ({:read => [], :access => [], :do => []}.merge(attrs))
    end

    def foam_permit?(action, controller, record)
      permitted = foam_whats_permitted?(action, controller, record)

      if action == :read || action == :write
        return permitted
      else
        return permitted.include?(action)
      end
    end

    def foam_whats_permitted?(action, controller, record = nil)
      permitted = []
  
      @foam_permit.each do |item|
        if !item[:for] || controller.permit?(item[:for], :record => record)

          permitted |= case action
            when :read            : item[:read] + item[:access]
            when :write           : item[:access]
            when :create, :delete : item[:do]
          end

        end
      end if @foam_permit
    
      permitted |= superclass.foam_whats_permitted?(action, controller, record) if superclass.respond_to?(:foam_whats_permitted?)

      return permitted
    end
  end
end