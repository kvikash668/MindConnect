# Dev environment — minimal cost setup
resource_group_name = "mindconnect-rg"
location            = "eastus"
acr_name            = "mindconnectacr"
aks_cluster_name    = "mindconnect-aks"
aks_node_count      = 2
aks_node_vm_size    = "Standard_B2s" # cheapest option ~$30/month per node
environment         = "dev"

tags = {
  project     = "mindconnect"
  environment = "dev"
  managed_by  = "terraform"
  owner       = "kvikash668"
}
