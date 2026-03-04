require_relative "boot"

require "rails/all"
Bundler.require(*Rails.groups)

module RfRepeatAppBackend
  class Application < Rails::Application
    config.load_defaults 7.2
    config.autoload_lib(ignore: %w[assets tasks])
    config.time_zone = "Tokyo"
    config.active_record.default_timezone = :local
    config.i18n.default_locale = :ja
    config.api_only = true
  end
end
