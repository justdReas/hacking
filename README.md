# Fixing your servers security issues

## Login to Snyk
For this project we want to use [Snyk](https://app.snyk.io/login?cta=login&loc=nav&page=homepage) to find and help fix all potential vulnerabilites in our code.

Make sure your [GitHub](https://github.com/) is connected with Snyk so that you can create a project that [Snyk](https://app.snyk.io/login?cta=login&loc=nav&page=homepage) can scan for vulnerabilities. 

Once that is done we can move on to the next step.
## Start your server
Start by running your server
```
npm start
```

## Update your dependencies
First we want to update old modules that we might have in a project. In our case we have an outdated express and cookie-parser. 

All we need to do (for npm, globally) is:
```
npm install -g npm-check-updates
```
Then run:
```
ncu -u
```
It will show you all dependencies that have been upgraded like bellow:
```
Upgrading /Users/dreas/Workspace/Course/Paketering/hacking-backend/package.json
[====================] 3/3 100%

 cookie-parser  ^1.4.2  →   ^1.4.6
 express        ^3.0.0  →  ^4.18.2
```
If you run `ncu -u` again immediately after you'll get a message like this:
```
Upgrading /Users/dreas/Workspace/Course/Paketering/hacking-backend/package.json
[====================] 3/3 100%
```
Do a `npm install` after that and you should have all the latest versions for all your dependencies for your project.

If you login to [Snyk](https://app.snyk.io/login?cta=login&loc=nav&page=homepage) 

## Header vulnerability
Start a new terminal/bash in the same directory as your project and write:
```
curl http://localhost:4000 --include
```
You should get a response with the following information:
```
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-8vJdDbg3SctiUlKr33iKMA"
Date: Thu, 20 Oct 2022 22:03:33 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
This response could let an attacker know that we have built an express app by looking at `X-Powered-By: Express`. The attacker could the use this to find out which version of express we are using to exploit any known vulnerabilities.

To hide this information we are going to use a middleware called Helmet. Helmet helps you secure your Express apps by setting various HTTP headers. It does not solve all problems, but helps.

## Install Helmet
Lets start by installing Helmet as a dependency:
```
npm install helmet
```
Open `server.js` and add the following lines:
```
const express = require("express");
// Get helmet
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
// Use helmet middleware
app.use(helmet());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).send("You did it!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```
Save and run `curl http://localhost:4000 --include` in the terminal/bash again. You should now see the default headers that Helmet sets.
```
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
Origin-Agent-Cluster: ?1
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
X-XSS-Protection: 0
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-VZsav0qYTFpFQnllZWKchW/W9uk"
Date: Thu, 20 Oct 2022 23:17:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
´X-Powered-By: Express` is now gone from the list making it a little harder for a potential attacker.

THelmet is also customizable. For more information on this go to [Helmets GitHub page](https://helmetjs.github.io/).
