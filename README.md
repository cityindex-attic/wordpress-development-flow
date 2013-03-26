# [PressupBox Development Boilerplate](http://#)

PressupBox Development Boilerplate is a development workflow aimed at distributed teams that use:

* Github
* Wordpress
* Stackato

Use it how you see fit.

## Project Leader

**David Laing**

+ [http://twitter.com/davidlaing](http://twitter.com/davidlaing)
+ [http://github.com/mrdavidlaing](http://github.com/mrdavidlaing)

## Getting started

1.  You must have VirtualBox v4.2.10 (https://www.virtualbox.org/wiki/Downloads) and 
1.  Vagrant v1.1.2 (http://docs.vagrantup.com/v2/installation/index.html) installed
>  :exclamation: Confirm that you have the right version of vagrant running - `vagrant --version` should show `Vagrant version 1.1.2`

1.  Clone this repo to your Dev machine (tested on OSX Mountain Lion, Windows 7 x64)
1.  `vagrant up` -> The first time you run this, it will download a 350MB VM image.  You might want to get a :coffee:
1.  `vagrant halt` then `vagrant up` -> The first time you run this it will install a bunch of software; so you might want to go answer StackOverflow questions questions
1.  `vagrant ssh` -> You're now in a sandbox environment on the VM which simulates the Stackato deployment environment
1.  `npm install`
1.  `grunt run` -> This will compile your app and launch a dev server that you can access via http://localhost:4567 on your Dev machine
1.  TODO Any changes you make on your dev machine will be automatically copied to your vagrant VM

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
