 
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

module FoamPublisher
  
  def foam_publish(obj)
    @dumped_objects ||= {}

    dump = dump_object(obj) || 'false'
    
    render_javascript(dump) if defined?(render_javascript)
    
    return dump
  end

  # Если параметр name указан, возвращяет строку вида "name: object_dump"
  # Если нет, вида "object_dump"
  def dump_object(obj, name = '')
    name += ': ' unless name.empty?

    case obj
      when String: name + obj.to_json
      when NilClass: name + "undefined"
      when TrueClass, FalseClass, Fixnum, Float, Integer, Bignum, Numeric: name + obj.to_s
        
      else
        if (json = dump_compound_object(obj)) != nil then
          name + json
        else
          nil
        end
        
      end
  end

  def dump_compound_object(obj)
    items = []

    factory = {}

    if obj.respond_to? :foam_permit?
      obj.foam_permit?(:read, controller = self).each { |method| items << dump_object(obj.send(method), method.to_s) }
      items.compact!

      if items.length != 0
        factory[:class] = obj.class.to_s
        factory[:id] = obj.id.to_s
        items << dump_object(obj.id, 'id')
      end

    elsif obj.kind_of? Array
      obj.each_with_index { |item, index| items << dump_object(item, index.to_s) }
      items.compact!

    elsif obj.kind_of? Hash
      obj.each { |key, value| items << dump_object(value, key.to_s) }
      items.compact!

    end

    return nil if items.length == 0 && !obj.kind_of?(Array)
    
    unless factory.empty?
      if @dumped_objects[factory[:class]+'#'+factory[:id]]
        items = [dump_object(obj.id, 'id'), dump_object(true, 'create_from_foam_factory')]
      else
        @dumped_objects[factory[:class]+'#'+factory[:id]] = true
      end
    end
    
    items.unshift "class: \"#{obj.class.to_s.underscore}\""
    
    return  "{#{items.join ', '}}"
  end
  
  
  def foam_save data = nil
    data = YAML.load(params[:data]) unless data
    puts data.inspect + "\n\n"
    ActiveRecord::Base.transaction do
      save_object data
      render_javascript('true') if defined?(render_javascript)
    end
  end
  
  def save_object data
  
    return (data.collect { |item| save_object(item) }) if data.kind_of? Array

    data.symbolize_keys!
    klass = data[:class].classify.constantize
    
    if klass == Hash # TODO kind_of? как написать?
      data.each do |item|
        save_object(item) if item.kind_of?(Hash) || item.kind_of?(Array)
      end
    
    elsif klass.respond_to?(:foam_permit?)
      id = data[:id].to_i
      object = if id > 0
          klass.find(id)
        else
          return unless klass.foam_permit?(:create, controller = self)
          klass.new
        end
        
      object.controller = self
      
      if data[:deleted]
        
        return unless klass.foam_permit?(:delete, controller = self)
        object.destroy
        
      else
        permitted_methods = object.foam_permit?(:write, controller = self)
        
        (permitted_methods & data.keys).each do |method|
          
          # Заполненеие аттрибута являющегося belongs_to association, при этом сохранение объекта, к которому мы belongs_to.
          if (association = klass.reflect_on_association(method))
            if association.macro == :belongs_to
              unless data[method]
                object.send("#{method}=", nil)
              else
                belongs_to = save_object(data[method])
                belongs_to = nil if belongs_to.frozen?
                object.send("#{method}=", belongs_to)
              end
            end
          
          # Сохранение аттрибута доступного как Hash (вариант поведения колонки типа BYTEA)
          elsif object.send(method).kind_of?(Hash)
            object.send(method).replace(data[method].symbolize_keys)
          
          # Сохранение обычного аттрибута
          else
            object.send("#{method}=", data[method])
          end
        end
        
        object.save
        
        klass.reflect_on_all_associations.select {|association| association.macro != :belongs_to && permitted_methods.include?(association.name)}.each do |association|
          case association.macro
            when :has_many:
              # TODO для отлинкованных как-нибудь NULL проставить
              save_object(data[association.name]).each do |item|
                object.send(association.name).push item unless item.frozen?
              end
              
            when :has_one:
              # TODO для отлинкованных как-нибудь NULL проставить
              has_one = save_object(data[association.name])
              object.send("#{association.name}=", has_one) unless has_one.frozen?
            
            when :has_and_belongs_to_many:
#             мы удаляем связи для удалённых и отлинкованных объектов
#             мы сохраняем весь массив дальних объектов
#             добавляем связи для объектов, к которым связи нет
          end
        end
      end # if data[:deleted]
      return object
    end # if klass.respond_to?(:foam_permit?)
  end
end
