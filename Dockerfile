###############################################################################
#                                     Run                                     #
###############################################################################

FROM nginx:alpine

LABEL org.opencontainers.image.authors="Adam Talsma <adam@talsma.ca>"

COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG DIST=dist
COPY $DIST /usr/share/nginx/html
