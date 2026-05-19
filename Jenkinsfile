pipeline {
  agent any

  environment {
    APP_NAME      = 'devops-lab-app'
    DOCKER_IMAGE  = "${APP_NAME}:${BUILD_NUMBER}"
    CONTAINER_NAME= 'devops-app-container'
    APP_PORT      = '3000'
  }

  tools {
    nodejs 'NodeJS-18'
  }

  stages {
    stage('📁 Checkout') {
      steps {
        echo "Checking out branch: ${env.GIT_BRANCH}"
        checkout scm
      }
    }

    stage('📦 Install Dependencies') {
      steps {
        // Changed from 'npm ci' to 'npm install' to bypass missing lockfile
        sh 'npm install'
      }
    }

    stage('🧪 Run Tests') {
      steps {
        sh 'npm test'
      }
      post {
        failure {
          echo '❌ Tests FAILED. Pipeline will halt here.'
        }
      }
    }

    stage('🐳 Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE} -t ${APP_NAME}:latest ."
      }
    }

    stage('🚀 Deploy Container') {
      steps {
        sh """
          docker stop ${CONTAINER_NAME} || true
          docker rm   ${CONTAINER_NAME} || true
          docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${DOCKER_IMAGE}
          echo "Deployed at: http://localhost:${APP_PORT}"
        """
      }
    }

    stage('💚 Health Check') {
      steps {
        echo "Waiting for app to initialize..."
        sleep 5
        sh "curl -f http://localhost:${APP_PORT}/health && echo '✅ App is healthy!'"
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'
    }
  }
}
