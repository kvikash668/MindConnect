terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }

  # Remote state in Azure Storage (uncomment after creating storage account)
  # backend "azurerm" {
  #   resource_group_name  = "mindconnect-rg"
  #   storage_account_name = "mindconnecttfstate"
  #   container_name       = "tfstate"
  #   key                  = "prod.terraform.tfstate"
  # }
}

provider "azurerm" {
  features {}
}
