We will be using MongoDb atlas to store the database on cloud to deploy purpose.


step 1:
    in this MongoDB atlas we will be making the user who will be only able to edit the project (we can edit the access too)
    username: virajyawale
    password: 680MC06VSje13Bz0

step 2:
    in this setup  we have to add the IP address of our machine but after it get online then the online cloud IP we have to add

step 3:
    to connect we get the url
    (mongodb+srv://virajyawale:680MC06VSje13Bz0@cluster0.4qyoh3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0)

    we have to change the mongo server link
    async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    }

    (NOTE: when we will open the project after replacing the link the the data of listing will be empty as it is not connect with the local system)

step 4:
    we will be using connect-mongo 
    (Why use connect-mongo?
    By default, express-session stores sessions in memory, which:

    ❌ Doesn't scale (lost on server restart)

    ❌ Is not shared across multiple servers (bad for production)

    ❌ Can lead to memory leaks over time)
    (Why Use connect-mongo in Deployment? -- chatGPT it!!!)

    using this the session which was get store in local system will be store in cloud (mongoDB atlas)

step 5: 
    using RENDER to deployment
        - for that we have to add "engines": {
                "node": "23.11.0"
            },in package.json to specify the version

    if we make the changes the we can deploy it with the option in deploy -- which will be easy

step 6: shift all the stuff which should not be deploy on github in .env file
        - secret
        (we don't have to deploy on github - .env & node_modules)
        steps-
            - git init  < convert the project to git project
            - touch .gitignore  < which will ingore the file which we do not want to uppload on repo
                .env
                node_modules/
                **/.DS_Store    (those three files we donot want to push in repo (DS_Store is only in macbook))


while deploying there will be error as the .env values are not known as well as the data on mongodb altas is accessed by the local system initially but while deployment it should be accessed by render

1. we add environment variables

2. in logs on render there will be IP address -- save it in mongodb atlas network access > add IP address