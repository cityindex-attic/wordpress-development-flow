#Simulate the Stackato container environment
export DATABASE_URL=mysql://root:secret_password@127.0.0.1:3306/wordpress
export DATABASE_ALWAYS_REFRESH="true"
export STACKATO_APP_ROOT=/app
export STACKATO_DOCUMENT_ROOT=/app/app
export DATABASE_SQL_DUMP="${STACKATO_DOCUMENT_ROOT}/db/wordpress.master.sql"
export PATH="$PATH:/opt/vagrant_ruby/bin"
