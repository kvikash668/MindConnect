resource "azurerm_virtual_network" "main" {
  name                = "mindconnect-vnet-${var.environment}"
  address_space       = ["10.0.0.0/8"]
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = merge(var.tags, { environment = var.environment })
}

resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.240.0.0/16"]
}
