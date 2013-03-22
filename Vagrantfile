# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :forwarded_port, guest: 4567, host: 4567

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", "1024"]
  end

$script = <<SCRIPT
sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password secret_password'
sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password secret_password'

if grep -Fxq "hiphop" /etc/apt/sources.list
 then
  echo "Already added additional package sources..."

 else
  echo "Adding additional package sources..."
  echo "deb http://dl.hiphop-php.com/ubuntu precise main" | sudo tee -a /etc/apt/sources.list

  sudo apt-get install python-software-properties -y
  sudo add-apt-repository ppa:richarvey/nodejs -y
  sudo add-apt-repository ppa:ondrej/php5 -y
  sudo apt-get update

fi

echo "Installing php & mysql"
sudo apt-get install php5 php5-mysql mysql-server-5.5 git-core curl -y

echo "Installing nodejs"
sudo apt-get install nodejs npm -y

echo "Installing hiphop"
sudo apt-get install hiphop-php -y --force-yes


if [ ! -f /usr/bin/whippet ]; then
  echo "Installing whippet"
  sudo git clone https://github.com/dxw/whippet.git /usr/local/whippet
  cd /usr/local/whippet && git submodule update --init
  sudo ln -s /usr/local/whippet/whippet /usr/bin/whippet
fi

if [ ! -f /usr/bin/wp ]; then
  echo "Installing wp-cli"
  sudo curl http://wp-cli.org/packages/phar/wp-cli.phar > /usr/bin/wp
  chmod +x /usr/bin/wp
fi

sudo npm install -g grunt-cli
sudo chown -R vagrant:vagrant /home/vagrant
cd /vagrant && npm install

echo "=-=-=-=-=-=-=-=-=-=-=-="
echo "Provisioning completed!"
echo "=-=-=-=-=-=-=-=-=-=-=-="
SCRIPT

  config.vm.provision :shell, :inline => $script
end
