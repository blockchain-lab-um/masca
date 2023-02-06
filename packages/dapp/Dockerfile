FROM blockchain-lab-um/ssi-snap:latest as builder

FROM nginx:1.23.3-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Change file ownership
RUN chown -R nginx:nginx /app && \
  chmod -R 755 /app && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Copy build artifacts
COPY --from=builder /app/packages/dapp/out /app/dapp

# Copy nginx config
COPY --from=builder /app/packages/dapp/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
