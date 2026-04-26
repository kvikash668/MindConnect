output "resource_group_name" {
  description = "Resource group name"
  value       = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "ACR login server URL — use as ACR_LOGIN_SERVER in GitHub secrets"
  value       = module.acr.acr_login_server
}

output "acr_admin_username" {
  description = "ACR admin username"
  value       = module.acr.acr_admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "ACR admin password — use as ACR_PASSWORD in GitHub secrets"
  value       = module.acr.acr_admin_password
  sensitive   = true
}

output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = module.aks.cluster_name
}

output "aks_kube_config" {
  description = "AKS kubeconfig — run: terraform output -raw aks_kube_config > ~/.kube/config"
  value       = module.aks.kube_config
  sensitive   = true
}

output "get_credentials_command" {
  description = "Run this after terraform apply to connect kubectl to your cluster"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.main.name} --name ${module.aks.cluster_name} --overwrite-existing"
}
