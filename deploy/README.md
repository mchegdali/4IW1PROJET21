# Deploy

## Nginx

### Configuration

- Nginx configuration is in folder `/etc/nginx` and `/etc/nginx/sites-available`
- Enable a site with `ln -s /etc/nginx/sites-available/fanthesie.fr.conf /etc/nginx/sites-enabled/fanthesie.fr.conf`
- To verify the configuration, run `nginx -t` (needs to be run as root)
- To reload the configuration, run `nginx -s reload` or `systemctl reload nginx` (needs to be run as root)

### SSL

- Certbot is used to generate the certificates
- Certbot is installed with `apt install certbot python3-certbot-nginx`
- Certbot is configured with `certbot --nginx`
- Automatic renewal is configured with `crontab -e`

## Fail2ban

### Configuration

- Fail2ban configuration is in /etc/fail2ban/jail.local
- Fail2ban configuration is in /etc/fail2ban/filter.d/nginx-403.conf
- Fail2ban configuration is in /etc/fail2ban/filter.d/nginx-404.conf
- Fail2ban configuration is in /etc/fail2ban/filter.d/nginx-422.conf
- To verify the configuration, run fail2ban-client status
- To reload the configuration, run fail2ban-client reload

## Samba

### Configuration

Samba configuration is in /etc/samba/smb.conf
To verify the configuration, run testparm

- Create a folder mkdir -p /srv/samba/lucas

Add rights to the folder to a user:

- chown lucas:lucas /srv/samba/lucas
- Create samba user with password: sudo smbpasswd -a lucas

To reload the configuration, run :

- systemctl reload smbd ## needs to be run as root
- systemctl reload nmbd ## needs to be run as root
