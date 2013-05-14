buildpack_config['type'] = 'multisite'
buildpack_config['plugins'] = [
	 'akismet'
	,'blackbox-debug-bar'
]

#buildpack_config['config_templates']['wordpress']['wp-config.php.erb'] = 'src/config-overrides/wordpress/wp-config.php.erb'