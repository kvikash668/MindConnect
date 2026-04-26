# ── Resource Group ────────────────────────────────────────────────────────────
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = merge(var.tags, { environment = var.environment })
}

# ── Virtual Network ────────────────────────────────────────────────────────────
module "vnet" {
  source              = "./modules/vnet"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
  tags                = var.tags
}

# ── Azure Container Registry ───────────────────────────────────────────────────
module "acr" {
  source              = "./modules/acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  acr_name            = var.acr_name
  environment         = var.environment
  tags                = var.tags
}

# ── AKS Cluster ───────────────────────────────────────────────────────────────
module "aks" {
  source              = "./modules/aks"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  cluster_name        = var.aks_cluster_name
  node_count          = var.aks_node_count
  node_vm_size        = var.aks_node_vm_size
  subnet_id           = module.vnet.aks_subnet_id
  acr_id              = module.acr.acr_id
  environment         = var.environment
  tags                = var.tags
}
