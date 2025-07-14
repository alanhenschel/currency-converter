# GitHub Actions Secrets Configuration

This document outlines the required secrets and environment variables for the CI/CD pipeline.

## Required GitHub Secrets

### AWS Configuration
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_ECR_REPOSITORY=currency-converter
```

### EC2 Deployment
```
EC2_HOST=your.ec2.instance.ip
EC2_USER=ubuntu
EC2_PORT=22
EC2_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
your_private_key_content
-----END OPENSSH PRIVATE KEY-----
```

### Application Configuration
```
CURRENCY_API_KEY=your_currency_api_key
PROD_DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/dbname
PROD_CURRENCY_API_KEY=your_production_api_key
```

### Optional Notification
```
SLACK_WEBHOOK=https://hooks.slack.com/services/your/slack/webhook
```

## AWS Setup Instructions

### 1. Create ECR Repository
```bash
aws ecr create-repository --repository-name currency-converter --region us-east-1
```

### 2. Create IAM User for GitHub Actions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. EC2 Instance Setup
```bash
# Install Docker
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure firewall
sudo ufw allow 8000
sudo ufw allow 22
sudo ufw enable
```

## Environment Files

### .env.example
```env
# Database
DATABASE_URL=postgresql://currency_user:currency_pass@localhost:5432/currency_db

# External API
CURRENCY_API_KEY=your_currency_api_key
CURRENCY_API_URL=https://app.currencyapi.com/

# Application
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### .env.production
```env
# Database (use AWS RDS endpoint)
DATABASE_URL=postgresql://username:password@your-rds-endpoint.region.rds.amazonaws.com:5432/currency_db

# External API
CURRENCY_API_KEY=your_production_currency_api_key
CURRENCY_API_URL=https://app.currencyapi.com/

# Application
ENVIRONMENT=production
LOG_LEVEL=WARNING
```

## Pipeline Workflow

1. **Trigger**: Push to main branch or CI workflow completion
2. **Build**: Install dependencies and run tests
3. **Docker**: Build and tag container image
4. **Push**: Upload image to AWS ECR
5. **Deploy**: SSH to EC2 and deploy new container
6. **Health Check**: Verify application is running correctly
7. **Notify**: Send deployment status to Slack (optional)

## Security Best Practices

- Store all sensitive data in GitHub Secrets
- Use IAM roles with minimal required permissions
- Rotate access keys regularly
- Enable MFA for AWS accounts
- Use HTTPS for all external communications
- Implement proper logging and monitoring
