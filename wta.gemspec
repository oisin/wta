# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'wta/version'

Gem::Specification.new do |spec|
  spec.name          = "wta"
  spec.version       = Wta::VERSION
  spec.authors       = ["Oisin Hurley"]
  spec.email         = ["oisin.hurley@gmail.com"]

  spec.summary       = %q{What the Amazon? Command line discovery for the AWS Status Page}
  spec.homepage      = "https://github.com/oisin/wta"
  spec.license       = "ASL 2.0"

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "bin"
  spec.executables   = ["wta"]
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 2.0"
  spec.add_development_dependency "rake", "~> 12.3"
  spec.add_development_dependency "minitest", "~> 5.11"

  spec.add_dependency "nokogiri", "~> 1.10"
  spec.add_dependency "colorize", "~> 0.8"
end
