reboot
sudo reboot
systemctl status sshd
apt update -y
sudo apt update -y
sudo apt upgrade -y
apt install ssh
sudo apt install ssh
systemctl status sshd
nano /etc/ssh/sshd_config
sudo nano /etc/ssh/sshd_config
visudo
sudo visudo
sudoer 
sudo visudo -s
ifconfig
ip addr
snap list
snap info microk8s
snap install microk8s --classic --channel="1.28/stable"
sudo snap install microk8s --classic --channel="1.28/stable"
sudo snap install microk8s --classic --channel="1.27/stable"
sudo microk8s.status
sudo microk8s.kubectl get nodes
sudo microk8s.enable dashboard
sudo microk8s.kubectl get pods -n kube-system
sudo microk8s.enable dns
sudo microk8s.status
nvidia-smi
sudo microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443
sudo microk8s.status
ls
git clone https://github.com/hyperbolic2346/kubernetes.git
ls
ls kubernetes
ls kubernetes/zoneminder
cd kubernetes/zoneminder
kubectl apply -f .
sudo kubectl apply -f .
sudo snap install kubectl
microk8s.kubectl apply -f .
sudo usermod -a -G microk8s bibi
sudo chown -R bibi ~/.kube
microk8s.kubectl apply -f .
sudo microk8s.kubectl apply -f .
sudo microk8s.kubectl get po
sudo microk8s.kubectl get pods -n kube-system
sudo microk8s.kubectl get pods
sudo microk8s.kubectl apply -f .
sudo microk8s.kubectl get pods -n all
sudo microk8s.kubectl get pods -n 
sudo microk8s.kubectl get pods all
sudo microk8s.kubectl get pods 
kubectl get deployments
microk8s.kubectl get deployments
ls a
ls -a
ls -a ~
sudo ls -a ~
kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
microk8s.kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
sudo microk8s.kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
sudo microk8s.kubectl get pods -n kube-system
sudo microk8s.kubectl get pods -n kube-defalut
sudo microk8s.kubectl get pods -n kube-default
kubectl get deployments
microk8s.kubectl get deployments
sudo microk8s.kubectl get deployments
sudo microk8s.kubectl rollout status deployment/nginx-deployment
sudo microk8s.kubectl get deployments
sudo microk8s.kubectl get pods --show-labels
sudo microk8s.kubectl apply -f .
sudo microk8s.kubectl get pods --show-labels
sudo microk8s.kubectl get services
ip addr
sudo microk8s.kubectl get pods
sudo microk8s.kubectl describe deployment
sudo microk8s.kubectl get pods --show-labels
ls ~
ls -a ~
su
sudo su -
su
docker-compose up -d
sudo snap install docker
docker-compose up -d
ls
docker-compose up -d
ls
cd ..
docker-compose up -d
tree -h
sudo snap install tree
tree /f /a
tree /f /a .
tree /f /a
docker-compose up -d
ip 
ip addr
docker ps
docker exec -it reciet_bolt-web /bin/bash
docker exec -it reciet_bolt-web-1 /bin/bash
docker ps
docker exec -it 0c86c0c77a7b /bin/bash
docker exec -it 0c86c0c77a7b sh
docker compose build
docker-compose up -d
docker exec -it reciet_bolt-web-1 /bin/bash
docker exec -it reciet_bolt-web-1 sh
git init
git add README.md
git clone https://github.com/kazumasaxx/pg.git
git remote add origin https://github.com/kazumasaxx/pg.git
git clone https://github.com/kazumasaxx/pg.git
echo "# pg" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kazumasaxx/pg.git
git push -u origin main
echo "# pg" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kazumasaxx/pg.git
git push -u origin main
git remote add origin https://github.com/kazumasaxx/pg.git
git init
git remote add origin https://github.com/kazumasaxx/pg.git
git branch -M main
git push -u origin main
git init
echo "# pg" >> README.md
git add README.md
git commit -m "first commit"
ls
ls -a
rm -rf .git
git init
echo "# pg" >> README.md
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/kazumasaxx/pg.git
git config user.email "kazumasaxx@gmail.com"
git config user.name "kazumasaxx"
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kazumasaxx/pg.git
git push -u origin main
docker ps
docker compose up -d
docker compose down && docker compose up -d
docker exec -it reciet_bolt-web-1 /bin/bash
docker exec -it reciet_bolt-web-1 /bin/sh
docker exec -it reciet_bolt-web-1 /bin/sh
ls
rm -rf .
rm -rf 
ls
rm -rf *
ls
ls ^a
ls -a
rm -rf .*
ls -a
docker ps
docker exec -it reciet_bolt-web-1 /bin/sh
docker exec -it reciet_bolt-web /bin/bash
docker exec -it reciet_bolt-web /bin/sh
docker exec -it vite_app /bin/bash
docker exec -it vite_app /bin/sh
docker exec -it nginx_reverse_proxy /bin/bash
docker exec -it nginx_reverse_proxy /bin/sh
docker ps
docker compose down && docker compose up -d
cd ..
docker compose down && docker compose up -d
docker ps
docker compose down && docker compose up -d
docker exec -it reciet_bolt-web-1 /bin/sh
docker compose down && docker compose up -d
docker compose down 
docker-compose up -d nginx
docker run --rm   -v ./certbot-data:/etc/letsencrypt   -v ./nginx:/var/www/html   certbot/certbot certonly   --webroot -w /var/www/html   -d your-domain.com   --email your@email.com   --agree-tos   --no-eff-email
docker compose down 
docker-compose up -d nginx
docker compose down 
docker-compose up -d nginx
docker run --rm   -v ./certbot-data:/etc/letsencrypt   -v ./nginx:/var/www/html   certbot/certbot certonly   --webroot -w /var/www/html   -d your-domain.com   --email your@email.com   --agree-tos   --no-eff-email
docker compose down 
ls
mkdir -p ./nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout ./nginx/certs/selfsigned.key   -out ./nginx/certs/selfsigned.crt   -subj "/C=JP/ST=Tokyo/L=Tokyo/O=LocalDev/OU=Dev/CN=localhost"
docker-compose up --build -d
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout ./cert/key.pem   -out ./cert/cert.pem   -subj "/C=JP/ST=Tokyo/L=Tokyo/O=LocalDev/OU=Dev/CN=localhost"
ls
cd nginx/
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout ./cert/key.pem   -out ./cert/cert.pem   -subj "/C=JP/ST=Tokyo/L=Tokyo/O=LocalDev/OU=Dev/CN=localhost"
ls
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout ./certs/key.pem   -out ./certs/cert.pem   -subj "/C=JP/ST=Tokyo/L=Tokyo/O=LocalDev/OU=Dev/CN=localhost"
cd ..
cd reciet_bolt/
ls
docker-compose up -d
docker ps
docker-compose up -d
docker-compose down && docker-compose up -d
docker ps
docker-compose down && docker-compose up -d
docker ps
docker logs nginx_reverse_proxy
docker ps
docker exec -it vite_app /bin/sh
docker-compose down && docker-compose up -d
docker exec -it vite_app /bin/sh
docker-compose down && docker-compose up -d
docker exec -it vite_app /bin/sh
docker-compose down && docker-compose up -d
chmod -R 777 .
sudo chmod -R 777 .
docker-compose down && docker-compose up -d
docker-compose down 
docker compose build
docker-compose down && docker-compose up -d
docker ps
docker logs vite_app
docker ps
docker-compose down && docker-compose up -d
docker ps
docker-compose down && docker-compose up -d
docker ps
docker-compose down && docker-compose up -d
docker ps
docker-compose down && docker-compose up -d
docker compose build
docker-compose down && docker-compose up -d
docker compose build
docker-compose down && docker-compose up -d
docker ps
docker-compose down 
docker-compose up -d nginx
docker ps
docker-compose down 
docker-compose up -d nginx
docker ps
docker-compose run --rm certbot
docker ps
docker-compose up -d 
docker-compose run --rm certbot
ping kazumasaxx.mynetgear.com
docker-compose up -d nginx
ping kazumasaxx.mynetgear.com
docker-compose run --rm certbot
/var/log/letsencrypt/letsencrypt.log
ls /var/log/letsencrypt/letsencrypt.log
docker ps
docker-compose up -d nginx
docker ps
docker logs nginx
docker-compose up -d nginx
docker ps
docker logs nginx
docker-compose up -d nginx
docker-compose down nginx
docker-compose up -d nginx
docker logs nginx
docker ps
docker logs reciet_app
docker-compose up -d
docker ps
docker-compose run --rm certbot
