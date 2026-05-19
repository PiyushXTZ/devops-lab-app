pipeline {
  // Tell Jenkins to run the entire pipeline inside a clean Node 18 container
  agent {
    docker {
      image 'node:18-alpine'
      // We map the laptop's Docker socket so we can still build images inside the container
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    APP_NAME      = 'devops-lab-app'
    DOCKER_IMAGE  = "${APP_NAME}:${BUILD_NUMBER}"
    CONTAINER_NAME= 'devops-app-container'
    APP_PORT      = '3000'
  }

  // We no longer need the 'tools' block because Node is already provided by the Docker image!

  stages {
    stage('📁 Checkout') {
      steps {
        echo "Checking out branch: ${env.GIT_BRANCH}"
        checkout scm
      }
    }

    stage('📦 Install Dependencies') {
      steps {
        // This runs inside the isolated node:18 container cleanly
        sh 'npm install'
      }
    }

    stage('🧪 Run Tests') {
      steps {
        // This runs inside the container too
        sh 'npm test'
      }
    }

    // Since we are running native Docker on your laptop, the rest of your deployment 
    // steps remain exactly the same
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
  }

  post {
    always {
      sh 'docker image prune -f || true'
    }
  }
}
