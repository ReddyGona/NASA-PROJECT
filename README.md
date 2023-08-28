# NASA-PROJECT

## Getting Started

1. Install [NodeJs](https://nodejs.org/en)
2. Create a free [Mongo Atlas](https://www.mongodb.com/atlas/database) database online or start a local MongoDB database.
3. Create a `server/.env` file with a `MONGO_URL` property set to your MongoDB connection string.
4. In the terminal* run
   
    ```
     
     npm install
     ```
    
## Running the Project

1. In the terminal, run:

   ```

   npm run deploy
   ```
3. Browse to the mission control frontend at [localhost:8000](http://localhost:8000) and schedule an interstellar launch!


## Docker
`Windows Users`
1. Ensure you have the latest version of Docker installed
2. Run `docker build -t nasa-project .`
3. Run `docker run -it -p 8000:8000 nasa-project`

`mac users with m1/m2 chip`
1. Run `docker build --platform linux/amd64 -t nasa-project .`
2. Run `docker run -it -p 8000:8000 nasa-project`


## Running the Tests

To run any automated tests, run `npm test`. This will: 
* Run all the client-side tests: `npm test --prefix client`
* Run all the server-side tests: `npm test --prefix server`


## Deploying Code In AWS EC2 Instance

1. Create An EC2 Instance With Amazon Linux `Free Tier Eligible`
2. Name EC2 Instance
3. Create New Key Pair Login
4. Network Settings
   1. Create New Security Group
   2. Allow SSH Traffic From `Anywhere`
   3. Click on Edit
      1. Go To Inbound Security Group Rules & Add Following
      2. ` Type : Custom TCP `
      3. ` Port : 8000 `
      4. ` Source Type : Anywhere `
5. Launch your EC2 Instance
`First Time Users`
7. Select `.pem` type key pair &
8. Save your key-pairs in ur local machine
`Existing Users`
9. You will have option to select key pair when creating vm & setting up the security group

## Setting Up Terminal

1. Open The Directory Where the Key-Pairs Are Downloaded
2. `Recommended` move the downloaded key pairs
3. Open Terminal and navigate to the respective directory

## Connecting to EC2 Instance

1. Open EC2 Instance & Click on `Connect` right top of screen
2. Select `SSH client`
3. copy the `chmod` and run it in ur terminal to ensure your key is not publicly viewable
4.
  `method : 1`
   run this command `ssh -i <Key-Pair> ec2-user@<public ip address>`

  `method : 1`
   copy the command available in Example & Replace <keypair_filename>.pem
   
   `command to update the amazon linux`
   
   1.
      ```
    
       sudo yum update -y
       ```
      
   2.  Install Docker
       ```
      
       sudo yum install docker
       ```
       
   3.  Start The Docker
       ```
      
       sudo service docker start
       ```
       
   4. Get Docker Details
      ```

      sudo docker info
      ```
  
   5.  `run user as root user for docker commands `
       sudo usermode -a -G docker `username`. eg  `user`@<ipaddress>

   6.  `Restart the EC2 Instance & Run This Command `

   7. Docker Run Command
     
      ```

      docker run --restart=always -p 8000:8000 <docker_image_name>
      ```
   


