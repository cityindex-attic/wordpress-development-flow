=== Release 2 (tag v24): 23 April 2013

* Renamed from mrdavidlaing/pressupbox-development-boilerplate to cityindex/wordpress-development-flow
* Switched from Grunt to Rake
* Generate WordPress plugin/theme documentation - rake docs[{plugins|themes},{name}] 
(eg, `rake docs[themes,twentytwelve] && rake run` then open `http://localhost:4567/docs/themes/twentytwelve/index.html`]
* XDebug debugging for IDE clients (#20)
* Prevent notifications in vagrant up that look like errors but are not (#4)
* Fix locale to en_US.utf8

=== Release 1: March 2013

* initial version
