# Ticket Support

## Docker Build & Push
docker build -t yourusername/project-pal:latest .
docker push yourusername/project-pal:latest

## Kubernetes Deployment
kubectl apply -f k8s/deploy.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
