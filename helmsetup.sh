cd /Users/vikashkumar/Documents/MindConnect/MindConnect

# Create all folders
mkdir -p helm/charts/api-gateway/templates
mkdir -p helm/charts/auth-service/templates
mkdir -p helm/charts/user-service/templates
mkdir -p helm/charts/social-service/templates
mkdir -p helm/charts/payment-service/templates
mkdir -p helm/argocd

# ── AUTH SERVICE ─────────────────────────────────────────
cat > helm/charts/auth-service/Chart.yaml << 'EOF'
apiVersion: v2
name: auth-service
description: MindConnect Auth Service
type: application
version: 1.0.0
EOF

cat > helm/charts/auth-service/values.yaml << 'EOF'
replicaCount: 1
image:
  repository: mindconnectacr.azurecr.io/mindconnect/auth-service
  tag: latest
  pullPolicy: Always
service:
  type: ClusterIP
  port: 5001
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
EOF

cat > helm/charts/auth-service/templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: mindconnect
  labels:
    app: auth-service
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 5001
          env:
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: MONGODB_URI
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: JWT_SECRET
            - name: PORT
              value: "5001"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: 5001
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 5001
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

cat > helm/charts/auth-service/templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: mindconnect
spec:
  selector:
    app: auth-service
  ports:
    - port: 5001
      targetPort: 5001
  type: ClusterIP
EOF

# ── USER SERVICE ─────────────────────────────────────────
cat > helm/charts/user-service/Chart.yaml << 'EOF'
apiVersion: v2
name: user-service
description: MindConnect User Service
type: application
version: 1.0.0
EOF

cat > helm/charts/user-service/values.yaml << 'EOF'
replicaCount: 1
image:
  repository: mindconnectacr.azurecr.io/mindconnect/user-service
  tag: latest
  pullPolicy: Always
service:
  type: ClusterIP
  port: 5002
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
EOF

cat > helm/charts/user-service/templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: mindconnect
  labels:
    app: user-service
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-service
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 5002
          env:
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: MONGODB_URI
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: JWT_SECRET
            - name: PORT
              value: "5002"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: 5002
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 5002
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

cat > helm/charts/user-service/templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: mindconnect
spec:
  selector:
    app: user-service
  ports:
    - port: 5002
      targetPort: 5002
  type: ClusterIP
EOF

# ── SOCIAL SERVICE ────────────────────────────────────────
cat > helm/charts/social-service/Chart.yaml << 'EOF'
apiVersion: v2
name: social-service
description: MindConnect Social Service
type: application
version: 1.0.0
EOF

cat > helm/charts/social-service/values.yaml << 'EOF'
replicaCount: 1
image:
  repository: mindconnectacr.azurecr.io/mindconnect/social-service
  tag: latest
  pullPolicy: Always
service:
  type: ClusterIP
  port: 5003
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
EOF

cat > helm/charts/social-service/templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: social-service
  namespace: mindconnect
  labels:
    app: social-service
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: social-service
  template:
    metadata:
      labels:
        app: social-service
    spec:
      containers:
        - name: social-service
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 5003
          env:
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: MONGODB_URI
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: JWT_SECRET
            - name: PORT
              value: "5003"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: 5003
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 5003
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

cat > helm/charts/social-service/templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: social-service
  namespace: mindconnect
spec:
  selector:
    app: social-service
  ports:
    - port: 5003
      targetPort: 5003
  type: ClusterIP
EOF

# ── PAYMENT SERVICE ───────────────────────────────────────
cat > helm/charts/payment-service/Chart.yaml << 'EOF'
apiVersion: v2
name: payment-service
description: MindConnect Payment Service
type: application
version: 1.0.0
EOF

cat > helm/charts/payment-service/values.yaml << 'EOF'
replicaCount: 1
image:
  repository: mindconnectacr.azurecr.io/mindconnect/payment-service
  tag: latest
  pullPolicy: Always
service:
  type: ClusterIP
  port: 5004
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
EOF

cat > helm/charts/payment-service/templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
  namespace: mindconnect
  labels:
    app: payment-service
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: payment-service
  template:
    metadata:
      labels:
        app: payment-service
    spec:
      containers:
        - name: payment-service
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 5004
          env:
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: MONGODB_URI
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: JWT_SECRET
            - name: RAZORPAY_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: RAZORPAY_KEY_ID
            - name: RAZORPAY_KEY_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: RAZORPAY_KEY_SECRET
            - name: PORT
              value: "5004"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: 5004
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /health
              port: 5004
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

cat > helm/charts/payment-service/templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: payment-service
  namespace: mindconnect
spec:
  selector:
    app: payment-service
  ports:
    - port: 5004
      targetPort: 5004
  type: ClusterIP
EOF

# ── API GATEWAY ───────────────────────────────────────────
cat > helm/charts/api-gateway/Chart.yaml << 'EOF'
apiVersion: v2
name: api-gateway
description: MindConnect API Gateway
type: application
version: 1.0.0
EOF

cat > helm/charts/api-gateway/values.yaml << 'EOF'
replicaCount: 2
image:
  repository: mindconnectacr.azurecr.io/mindconnect/api-gateway
  tag: latest
  pullPolicy: Always
service:
  type: ClusterIP
  port: 3000
ingress:
  enabled: true
  host: mindconnect.172.214.66.167.nip.io
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
EOF

cat > helm/charts/api-gateway/templates/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: mindconnect
  labels:
    app: api-gateway
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
        - name: api-gateway
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 3000
          env:
            - name: API_GATEWAY_PORT
              value: "3000"
            - name: AUTH_SERVICE_PORT
              value: "5001"
            - name: USER_SERVICE_PORT
              value: "5002"
            - name: SOCIAL_SERVICE_PORT
              value: "5003"
            - name: PAYMENT_SERVICE_PORT
              value: "5004"
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: mindconnect-secrets
                  key: JWT_SECRET
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

cat > helm/charts/api-gateway/templates/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: mindconnect
spec:
  selector:
    app: api-gateway
  ports:
    - port: 3000
      targetPort: 3000
  type: ClusterIP
EOF

cat > helm/charts/api-gateway/templates/ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  namespace: mindconnect
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: mindconnect.172.214.66.167.nip.io
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 3000
EOF

# ── ARGOCD APPS ───────────────────────────────────────────
for service in api-gateway auth-service user-service social-service payment-service; do
cat > helm/argocd/$service-app.yaml << EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: $service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/kvikash668/MindConnect.git
    targetRevision: main
    path: helm/charts/$service
  destination:
    server: https://kubernetes.default.svc
    namespace: mindconnect
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF
done

echo "All done! Verifying structure..."
find helm -type f | sort
