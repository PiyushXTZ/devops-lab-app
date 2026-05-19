pipeline {
  // Turn off the global agent so we can specify them per stage
  agent none

  environment {
    APP_NAME      = 'devops-lab-app'
    DOCKER_IMAGE  = "${APP_NAME}:${BUILD_NUMBER}"
    CONTAINER_NAME= 'devops-app-container'
    APP_PORT      = '3000'
  }

  stages {
    stage('📁 Checkout') {
      agent any // Run checkout on the host machine
      steps {
        echo "Checking out branch: ${env.GIT_BRANCH}"
        checkout scm
      }
    }

    stage('📦 Install Dependencies') {
      // Run ONLY this stage inside the Node container
      agent {
        docker { image 'node:18-alpine' }
      }
      steps {
        sh 'npm install'
      }
    }

    stage('🧪 Run Tests') {
      // Run ONLY this stage inside the Node container
      agent {
        docker { image 'node:18-alpine' }
      }
      steps {
        sh 'npm test'
      }
    }

    stage('🐳 Build Docker Image') {
      agent any // Drop back to the Ubuntu laptop host where the 'docker' command exists
      steps {
        sh "docker build -t ${DOCKER_IMAGE} -t ${APP_NAME}:latest ."
      }
    }

    stage('🚀 Deploy Container') {
      agent any // Run deployment actions directly on the host machine
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
      agent any
      steps {
        echo "Waiting for app to initialize..."
        sleep 5
        sh "curl -f http://localhost:${APP_PORT}/health && echo '✅ App is healthy!'"
      }
    }
  }

  post {
    always {
      node('built-in') { // Ensures post actions run on the native built-in node
        sh 'docker image prune -f || true'
      }
    }
  }
}
