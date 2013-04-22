#!/bin/bash

if [[ ! "$(locale)" =~ "en_US.utf8" ]]; then
  echo "Setting perl:locale to en_US.UTF8"
  export LANGUAGE=en_US.UTF-8
  export LANG=en_US.UTF-8
  export LC_ALL=en_US.UTF-8
  locale-gen en_US.UTF-8
  sudo dpkg-reconfigure locales
fi

if [ "`tail -1 /root/.profile`" = "mesg n" ]; then
  echo 'Patching basebox to prevent future `stdin: is not a tty` errors...'
  sed -i '$d' /root/.profile
  cat << 'EOH' >> /root/.profile
  if `tty -s`; then
    mesg n
  fi
EOH
fi

if [ ! -f /usr/bin/curl ]; then
  echo "Installing curl"
  sudo apt-get install curl -y
fi
echo "curl:\t$(curl --version)" | head -n 1

if [ ! -d /opt/VBoxGuestAdditions-4.2.10 ]; then
  echo "Upgrading VBoxGuestAdditions"
  curl --location http://download.virtualbox.org/virtualbox/4.2.10/VBoxGuestAdditions_4.2.10.iso > /tmp/VBoxGuestAdditions_4.2.10.iso
  sudo mount /tmp/VBoxGuestAdditions_4.2.10.iso -o loop /mnt
  sudo apt-get install build-essential module-assistant linux-headers-$(uname -r) -y
  sudo sh /mnt/VBoxLinuxAdditions.run --nox11
  echo "=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-="
  echo " VBoxGuestAdditions updated.  Please run: vagrant halt && vagrant up "
  echo "=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-="
  exit 1
fi 

echo "Setting perl:locale to en_US.UTF8"
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales

if [[ ! "$(ruby --version)" =~ "ruby 1.9.3" ]]; then
  echo "Upgrading ruby to 1.9.1"
  sudo apt-get install ruby1.9.1 ruby1.9.1-dev \
    rubygems1.9.1 irb1.9.1 ri1.9.1 rdoc1.9.1 \
    build-essential libopenssl-ruby1.9.1 libssl-dev zlib1g-dev \
    libxslt-dev libxml2-dev -y
   
  sudo update-alternatives --install /usr/bin/ruby ruby /usr/bin/ruby1.9.1 400 \
           --slave   /usr/share/man/man1/ruby.1.gz ruby.1.gz \
                          /usr/share/man/man1/ruby1.9.1.1.gz \
          --slave   /usr/bin/ri ri /usr/bin/ri1.9.1 \
          --slave   /usr/bin/irb irb /usr/bin/irb1.9.1 \
          --slave   /usr/bin/rdoc rdoc /usr/bin/rdoc1.9.1
   
  # choose your interpreter
  # changes symlinks for /usr/bin/ruby , /usr/bin/gem
  # /usr/bin/irb, /usr/bin/ri and man (1) ruby
  sudo update-alternatives --config ruby || true
  sudo update-alternatives --config gem  || true

  echo -e "#Ensure gems are in path\nexport PATH=\$PATH:/var/lib/gems/1.9.1/bin/" >> /etc/profile
fi
echo "ruby:\t$(ruby --version)"

if [[ "$(gem query -n bundler -d | wc -l)" =~ "1" ]]; then
  sudo gem install bundle --no-ri --no-rdoc
else
  bundle --version
fi

if [ ! -f /usr/bin/mysql ]; then
  echo "Installing Mysql"
  sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password secret_password'
  sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password secret_password'
  sudo apt-get install mysql-server-5.5 -y
fi
echo "mysql:\t$(mysql --version)"

if [ ! -f /usr/bin/git ]; then
  echo "Installing git"
  sudo apt-get install git-core -y
fi
echo "git:\t$(git --version)"

if [[ ! "$(php --version)" =~ "PHP 5.4" ]]; then
  echo "Installing PHP5"
  sudo apt-get install python-software-properties -y
  sudo add-apt-repository ppa:ondrej/php5 -y
  sudo apt-get update
  sudo apt-get install php5 php5-mysql -y
fi
echo "php:\t$(php -v)" | head -n 1

if [[ ! -f /usr/bin/phpdoc ]]; then
  echo "Installing phpDocumentator2"
  sudo apt-get -y update
  sudo apt-get -y install php5-xsl graphviz php-pear 2>/dev/null
  sudo pear channel-discover pear.phpdoc.org
  sudo pear install phpdoc/phpDocumentor-alpha
fi
echo "phpdoc:\t$(phpdoc --version)"

if [[ ! "$(node --version)" =~ "v0.10" ]]; then
  echo "Installing nodejs"
  sudo apt-get install python-software-properties -y
  sudo add-apt-repository ppa:richarvey/nodejs -y  
  sudo apt-get update
  sudo apt-get install nodejs npm -y
fi
echo "node:\t$(node -v)"

if [ ! -f /usr/bin/wp ]; then
  echo "Installing wp-cli"
  sudo curl http://wp-cli.org/packages/phar/wp-cli.phar > /usr/bin/wp
  chmod +x /usr/bin/wp
fi

if [ ! -f /usr/bin/stackato ]; then
    sudo curl -k --location -o /tmp/stackato.zip https://api.stackato.cil.stack.me/static/stackato-1.6.1-linux-glibc2.3-x86_64.zip 
    sudo apt-get install unzip -y 
    sudo unzip /tmp/stackato.zip -d /tmp
    sudo mv /tmp/stackato-1.6.1-linux-glibc2.3-x86_64/stackato /usr/bin
    sudo rm -rf /tmp/stackato*
fi
echo "stackato:\t$(stackato --version)"

echo "Setting perl:locale to en_US.UTF8"
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales

if [ ! -f /usr/bin/unison ]; then
  sudo apt-get install unison -y
fi
echo "unison:\t$(unison -version)"

echo "Clean up..."
sudo apt-get autoremove -y | tail -n 1
rm -f /home/vagrant/postinstall.sh
rm -f /tmp/VBoxGuestAdditions_4.2.10.iso

echo "Copying host source files into place"
rsync -a --exclude='.git*' --exclude='.vagrant' --exclude='.DS_Store' /vagrant/ /home/vagrant/

echo "Configuring build dependancies"
bundle install

echo "=-=-=-=-=-=-=-=-=-=-=-="
echo "Provisioning completed!"
echo "=-=-=-=-=-=-=-=-=-=-=-="
