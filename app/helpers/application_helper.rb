module ApplicationHelper
  # エラーメッセージを表示するヘルパーメソッド
  def display_errors_for(field_name)
    if flash[:error_messages]
      Rails.logger.debug("DEBUG: Inside display_errors_for for #{field_name}")
      # 現在のロケールに基づいてフィールド名を翻訳
      translated_field_name = I18n.t("activerecord.attributes.user.#{field_name}")
      # 翻訳されたフィールド名を含むエラーメッセージを選択
      errors = flash[:error_messages].select { |msg| msg.include?(translated_field_name) }
      if errors.any?
        combined_errors = errors.map { |err| "<i class='fa-light fa-exclamation' style='color: #fa0000;'></i> " + err }.join(", ")
        content_tag(:div, combined_errors.html_safe, class: 'alert alert-danger mt-2')
      end
    end
  end
end
