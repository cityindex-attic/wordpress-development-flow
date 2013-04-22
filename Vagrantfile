Vagrant.configure("2") do |config|                                                                                                                                                        
  config.vm.box = "pressupbox-development-boilerplate-20130327"
  config.vm.box_url = "https://s3-eu-west-1.amazonaws.com/ci-vagrantboxes/pressupbox-development-boilerplate-20130327.box"

  config.vm.network :forwarded_port, guest: 4567, host: 4567

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", "1024"]
  end

  config.sync.host_folder = "src"  #relative to the folder your Vagrantfile is in
  config.sync.guest_folder = "src" #relative to the vagrant home folder -> ~/

  config.vm.provision :shell, :path => "provision.sh"
end

