variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "mindconnect-rg"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "acr_name" {
  description = "Azure Container Registry name (must be globally unique)"
  type        = string
  default     = "mindconnectacr"
}

variable "aks_cluster_name" {
  description = "AKS cluster name"
  type        = string
  default     = "mindconnect-aks"
}

variable "aks_node_count" {
  description = "Number of nodes in AKS default node pool"
  type        = number
  default     = 2
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default = {
    project    = "mindconnect"
    managed_by = "terraform"
  }
}
