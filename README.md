End-to-End Deployment of Node.js Application on Azure AKS
Project Overview
This project demonstrates an end-to-end cloud-native deployment of a Node.js application on Azure Kubernetes Service (AKS) using Terraform, Docker, CI/CD, Kubernetes, and Helm.
The goal of this project is to showcase how modern DevOps practices are used to:
* Provision cloud infrastructure using Infrastructure as Code (IaC)
* Containerize applications
* Automate build and push using CI/CD pipelines
* Deploy and manage applications on Kubernetes
* Securely integrate AKS with Azure Container Registry (ACR)

Architecture Overview
Developer
   ? (Git Push)
CI/CD Pipeline
   ?
Docker Image Build
   ?
Azure Container Registry (ACR)
   ?
Azure Kubernetes Service (AKS)
   ?
Kubernetes Deployment & Service
   ?
Application Access

Technology Stack
CategoryToolsCloud ProviderMicrosoft AzureInfrastructure as CodeTerraformContainerizationDockerCI/CDYAML-based PipelineContainer RegistryAzure Container Registry (ACR)OrchestrationKubernetes (AKS)Configuration ManagementHelmApplicationNode.js (Express)
?? Project Structure
??? terraform/
?   ??? providers.tf
?   ??? variables.tf
?   ??? aks-data.tf
?   ??? acr-data.tf
?   ??? aks-acr-rbac.tf
?   ??? terraform.tfstate
?
??? app/
?   ??? server.js
?   ??? package.json
?   ??? Dockerfile
?
??? ci/
?   ??? docker-ci.yml
?
??? k8s/
?   ??? deployment.yaml
?   ??? service.yml
?
??? helm/
?   ??? retail.yml
?   ??? values.yml
?
??? README.md

Infrastructure Setup (Terraform)
Terraform is used to integrate AKS and ACR securely.
Key Terraform Files
* providers.tf
Configures Azure, Kubernetes, and Helm providers.
* variables.tf
Stores reusable configuration variables (AKS name, ACR name, location, etc.).
* aks-data.tf
Reads existing AKS cluster details.
* acr-data.tf
Reads existing Azure Container Registry details.
* aks-acr-rbac.tf
Assigns AcrPull role to AKS managed identity to pull images from ACR.
?? terraform.tfstate stores Terraform state and should not be edited manually.

Application Details
* Language: Node.js
* Framework: Express
* Port: 3000
* Endpoint: /
Sample response:
AKS End-to-End Project is LIVE

Containerization (Docker)
The application is containerized using Docker.
Dockerfile Responsibilities:
* Uses Node.js base image
* Copies application code
* Installs dependencies
* Exposes port 3000
* Runs the application
This ensures consistency across environments.

CI/CD Pipeline
The CI pipeline automates the Docker image lifecycle.
Pipeline Steps:
1. Checkout source code
2. Build Docker image
3. Authenticate with Azure Container Registry
4. Push Docker image to ACR
Result:
Every code change produces a new deployable Docker image.

Kubernetes Deployment
Deployment (deployment.yaml)
* Runs the application as Pods in AKS
* Supports scaling and self-healing
* Uses Docker image from ACR
Service (service.yml)
* Exposes the application inside the cluster using ClusterIP
* Can be switched to LoadBalancer for public access

Helm Configuration
Helm is used to manage Kubernetes manifests in a reusable way.
* retail.yml – Helm template
* values.yml – Environment-specific values (replicas, image, service type)
This allows easy upgrades, rollbacks, and configuration changes.

Validation & Troubleshooting Commands
kubectl get pods
kubectl get svc
kubectl get deployment
kubectl logs <pod-name>
kubectl describe svc retail-service
kubectl get events

Key Learnings
* Infrastructure provisioning using Terraform
* Secure AKS–ACR integration with managed identity
* Docker-based application packaging
* CI/CD automation for container images
* Kubernetes deployment and service management
* Helm-based configuration management

Future Enhancements
* Add Ingress Controller (NGINX)
* Implement Horizontal Pod Autoscaler (HPA)
* Enable monitoring with Prometheus & Grafana
* Secure application using HTTPS & cert-manager
* Add multi-environment support (dev / qa / prod)

????? Author
Kamlesh Wamankar
DevOps | Cloud | Kubernetes | Terraform

