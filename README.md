# [PressupBox Development Boilerplate](http://#)

[![Build Status](http://ci.labs.cityindex.com:8080/job/pressupbox-development-boilerplate/badge/icon)](http://ci.labs.cityindex.com:8080/job/pressupbox-development-boilerplate/)

PressupBox Development Boilerplate is a development workflow aimed at distributed teams:

Wordpress development teams can use the pressupbox development boilerplate to closely match the teams development environment 
with both the live and testing environments. By using Vagrant on the developers machine and Stackato on the testing and live server, 
a virtual machine encapsulating a github repository can be deployed to both the developer, the testing environment and the 
live server. This helps to work along the [Dev / Prod parity](http://www.12factor.net/dev-prod-parity) by ensuring that 
everybody is working of the same underlying environment as possible, whilst the devoloper is free to choose their own 
IDE and development tools. Features can be built and tested locally, deployed to a test or build server and then 
deployed to a live server - all utilizing the same underlying environment

The pressupbox developement boilerplate involves:
* Github
* Wordpress
* Stackato
* Vagrant
* Virtualbox

## Project Leader

**David Laing**

+ [http://github.com/mrdavidlaing](http://github.com/mrdavidlaing)

## Getting started

1.  Install Vagrant v1.1.4 (http://docs.vagrantup.com/v2/installation/index.html)
1.  Install VirtualBox v4.2.10 (https://www.virtualbox.org/wiki/Downloads) 
>  :exclamation: The version numbers are important; and the process of upgrading from vagrant 1.0 to 1.1 is non trivial.
> Follow the installation instructions and then make sure you are running the right version of vagrant 
```
$ vagrant --version
Vagrant version 1.1.4
```

1.  Clone _this_ repo to your Dev machine (tested on OSX Mountain Lion, Windows 7 x64, Ubuntu 12.10)
1.  From the root of your freshly cloned repo, run `vagrant up` to start your development VM 
> * The `vagrant up` config process is idempotent.  If you see any errors, just restart the process by running `vagrant reload`
> * The first time you run this, it will download a 800MB VM image from Amazon S3 in Ireland.  
>      * If you have a slow (<10MB) / unreliable Internet connection you might want to download the VM separately using a download manager.
>      * See the `config.vm.box_url` section of the `Vagrantfile` for the download url.  Append `?torrent` to this to get a BitTorrent download.  You can manually register your downloaded VM using `vagrant box add {config.vm.box} {path/to/downloaded/name.box}
>      * If you're on a fast connection, just grab a :coffee: and let `vagrant up` do all the downloading for you

1.  `vagrant ssh` -> You're now in a sandbox environment on the VM which simulates the Stackato deployment environment.  From inside your vagrant ssh terminal you can:
    1.  `grunt run` -> This will compile your app and launch a dev server that you can access at [http://localhost:4567](http://localhost:4567) on your Dev machine
    1.  TODO Any changes you make on your dev machine will be automatically copied to your vagrant VM.  Currenty you must run
`rsync -a --exclude='.git*' --exclude='.vagrant' --exclude='.DS_Store' /vagrant/ /home/vagrant/` from your vagrant ssh terminal after each file change

## Concepts involved

1. [Dev / Prod parity](http://www.12factor.net/dev-prod-parity) -> A local development build & run time is encapsulated in a
Vagrant VM.  Whilst the developer is free to choose their editor tooling; they will be running & debugging their code in an
environment that is nearly identical to the production deployment environment as possible.  
1. Buildpack -> 
1. Build script - the following tasks are automated using the build script:
   1. Compilation - converting source code to running code 
   1. Running - starting 
   1. Deployment
1. Continuous Integration Server - source code events trigger the CI server to run build script tasks; and report on their success or failure
1. Platform as a Service - The hosting platform is a PaaS; enabling scripted deployment

## Contributing to this project (bug reports, feature requests, pull requests)

Have a bug, feature request or pull request? [Please open a new issue](https://github.com/cityindex/remote-development-boilerplate/issues).
Anyone and everyone is welcome to contribute, but please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md) to make this process
easy and effective for everyone, in particular:

* [Reporting bugs](CONTRIBUTING.md#reporting-bugs)
* [Requesting features](CONTRIBUTING.md#requesting-features)
* [Submitting pull requests](CONTRIBUTING.md#submitting-pull-requests)

## Brief history

[Murally board that started the project](http://mrl.li/ZFs4qk)

## Copyright and license

License info here...
