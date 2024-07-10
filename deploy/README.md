# Deploy

## Nginx

### Configuration

- Nginx configuration is in folder `nginx`
- To verify the configuration, run `nginx -t` (needs to be run as root)
- To reload the configuration, run `nginx -s reload` or `systemctl reload nginx` (needs to be run as root)

### SSL

- Certbot is used to generate the certificates
- Certbot is installed with `apt install certbot python3-certbot-nginx`
- Certbot is configured with `certbot --nginx`
- Automatic renewal is configured with `crontab -e`
