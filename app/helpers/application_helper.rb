module ApplicationHelper
  def display_errors_for(field_name)
    if flash[:error_messages]
       errors = flash[:error_messages].select { |msg| msg.include?(field_name.capitalize) }
      if errors.any?
        content_tag(:div, errors.join(", "), class: 'alert alert-danger mt-2')
      end
    end
  end
end
