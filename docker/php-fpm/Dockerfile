FROM alpine:3.6

LABEL maintainer="Jake Litwicki <jake.litwicki@gmail.com>"

RUN apk add --update \
    php7-fpm \
    php7-common \
    php7-pear \
    php7-dev \
    php7-xmlrpc \
    php7-session \
    php7-gettext \
    php7-json \
    php7-xdebug \
    php7-bcmath \
    php7-simplexml \
    php7-dom \
    php7-apcu \
    php7-ctype \
    php7-curl \
    php7-dom \
    php7-gd \
    php7-iconv \
    php7-imagick \
    php7-json \
    php7-intl \
    php7-mcrypt \
    php7-mbstring \
    php7-opcache \
    php7-openssl \
    php7-pdo \
    php7-pdo_mysql \
    php7-mysqli \
    php7-xml \
    php7-zlib \
    php7-phar \
    php7-tokenizer \
    make \
    curl \
    openssl

RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

RUN curl --insecure https://getcomposer.org/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

ADD tavro.ini /etc/php7/php-fpm.d/
ADD tavro.ini /etc/php7/cli/conf.d/

ADD tavro.pool.conf /etc/php7/php-fpm.d/

CMD ["php-fpm7", "-F"]

WORKDIR /var/www/tavro

EXPOSE 9000
