#!/bin/bash

for service in auth-service user-service social-service payment-service; do
  case $service in
    auth-service) port=5001 ;;
    user-service) port=5002 ;;
    social-service) port=5003 ;;
    payment-service) port=5004 ;;
  esac

  echo -e "\nport: $port" >> /Users/vikashkumar/Documents/MindConnect/MindConnect/helm/charts/$service/values.yaml
done
