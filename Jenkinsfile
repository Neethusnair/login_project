node {
    def app

    stage('Clone repository') {
        /* Cloning the Repository to our Workspace */

        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image */

        app = docker.build("neethusnair/login_jenkins_file")
    }

//     stage('Test image') {
        
//         app.inside {
//             echo "Tests passed"
//         }
//     }

    stage('Push image') {
        /* 
			You would need to first register with DockerHub before you can push images to your account
		*/
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
//             app.push("${env.BUILD_NUMBER}")
//             app.push("latest")
	       app.push()
            } 
// 	    docker login -u $DOCKER_USER -p $DOCKER_HUB_PASSWORD
// 	    docker push neethusnair23/login_jenkins_file
                echo "Trying to Push Docker Build to DockerHub"
    }
}
