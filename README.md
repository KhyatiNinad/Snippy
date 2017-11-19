# Snippy

Snippy is your Code Snippet Manager for your Team, which manages Code Snippets and Internal Team Learnings & Tutorials for your team in a secure manner and with an easy to search interface..

As a team member, you can contribute by creating Code Snippets to the repository. Snippy provides an Editor to write your code in, with in-built language syntax highlighting of your choice.

Your team members can easily search for Code Snippets & Tutorials through a powerful tag and full text search based search engine, and use them in their modules.

That's how coding gets easier...!

# Built Using

Snippy is built using ReactJS and can be self-hosted on NodeJS and MongoDB, using Facebook Login for Authentication. Now, any Team can use the functionality on their own and even customize it as per their needs.

# How to Use

* Download the Repository
* Create a Facebook Application and get details of your Client Id and Secret. Details [here](https://developers.facebook.com/docs/facebook-login/web)
* In the repository, Open File server/config/auth.js. Update Your Client Id, Secret and Callback URL
* Get a MongoDB Hosting 
* In the repository, Open File server/config/database.js.Update the COnnection String for your MongoDB.
* From base folder, Go to command prompt and type in command **npm install** to download all dependant Node Components
* From base folder, Go to command prompt and type in command **npm start** to run the application locally
* To move to prod, Run command **npm run build**to get the Minified Assets. Use the package_Deploy.json instead of package.json abd deploy on a NodeJS hosted server 

# Open Source

* Snippy uses multiple Open Source NodeJS components, details found in package.json
* Snippy UI is built using Bootstrap Theme by [Creative Tim](creative-tim.com/bootstrap-themes/free)
