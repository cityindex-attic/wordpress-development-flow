#Simulate the Stackato container environment
export DATABASE_URL=mysql://root:secret_password@127.0.0.1:3306/wordpress
export DATABASE_ALWAYS_REFRESH="true"
export STACKATO_APP_ROOT=/app
export STACKATO_DOCUMENT_ROOT=/app/app
export HOME=$STACKATO_APP_ROOT/app
export DATABASE_SQL_DUMP="${STACKATO_DOCUMENT_ROOT}/db/wordpress.master.sql"
export PATH="$PATH:/opt/vagrant_ruby/bin:/app/app/bin"
export VCAP_APPLICATION="{\"instance_id\":\"vagrant001\",\"instance_index\":0,\"name\":\"vagrant\",\"uris\":[\"localhost\"],\"group\":\"\",\"version\":\"0\",\"start\":\"2013-06-13 02:07:06 +0000\",\"runtime\":\"python27\",\"state_timestamp\":1371089226,\"port\":37183,\"lxcip\":\"192.168.3.4\",\"lxcport\":3000,\"users\":[\"david.laing@labs.cityindex.com\"],\"limits\":{\"fds\":256,\"mem\":268435456,\"disk\":2147483648,\"sudo\":false},\"host\":\"127.0.0.1\"}"

export BUILDPACK_URL=https://github.com/mrdavidlaing/stackato-buildpack-wordpress.git
export BUILDPACK_HOOK_POST_COMPILE=/app/app/.build/install-extra-runtime-components
