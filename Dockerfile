FROM alpine:latest


ENV PUID=1000
ENV GUID=100

RUN echo $UID
RUN adduser -D -u $PUID -G users -h /foundry -s /bin/bash foundry

# Install dependencies and folder creation
RUN apk update && apk add --no-cache ca-certificates libstdc++ su-exec bash-completion tar nodejs npm \
	&& mkdir -p /foundry /ftemp \
	&& chmod 777 -R /foundry \
	&& chown $PUID:100 -R /foundry

# directory where data is stored
VOLUME /foundry

# TCP Port
EXPOSE ${npm_config_port}

ADD scripts/install-script.sh /scripts/install-script.sh

# Run command
CMD [ "/bin/sh", "/scripts/install-script.sh" ]
