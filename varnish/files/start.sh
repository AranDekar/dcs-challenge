#!/bin/sh

cat <<EOF > /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /dev/stderr;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 65535;
    multi_accept on;
    use epoll;
}

http {
    access_log off;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    resolver $( [ $ECS_CONTAINER_METADATA_URI ] && echo "169.254.169.253:53" || echo  "127.0.0.11:53" ) ipv6=off valid=30s;

    server {
        listen       8080 default_server;
        listen       [::]:8080 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        location / {
            set \$backend "http://$BACKEND_HOST:$BACKEND_PORT";
            proxy_pass \$backend\$request_uri;
            proxy_set_header Host \$http_host;
        }
    }
}
EOF

nginx

/start.original.sh