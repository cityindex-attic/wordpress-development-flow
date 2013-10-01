Vagrant.configure("2") do |config|                                                                                                                                                        
  config.vm.box = "pressupbox-development-boilerplate-20130327"
  config.vm.box_url = "https://s3-eu-west-1.amazonaws.com/ci-vagrantboxes/pressupbox-development-boilerplate-20130327.box"

  config.vm.network :forwarded_port, guest: 4567, host: 4567
  config.vm.network :forwarded_port, guest: 9222, host: 9222

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", "1024"]
  end
  
  #config.vm.synced_folder "/Users/mrdavidlaing/Projects/mrdavidlaing/stackato-buildpack-wordpress", "/app/buildpack"
  
  config.vm.provision :shell, :path => ".build/provision-vagrant"

end

