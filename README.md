TodoScheduler WebClient [![Build Status](https://travis-ci.org/wichmannpas/todoscheduler-webclient.svg?branch=master)](https://travis-ci.org/wichmannpas/todoscheduler-webclient)
=================================================================================================================================================================================

TodoScheduler helps you managing and scheduling your tasks. You can split your tasks into chunks and schedule them for specific days.
Scheduling all of your tasks means less postponed tasks and a higher productivity. That means more free time!

This repository contains a JavaScript web frontend of TodoScheduler.
The backend can be found in [this repository](https://github.com/wichmannpas/todoscheduler).

Configuration
-------------

The configuration of the client is located in `src/config.js`.
This file contains the URL of the backend API and additional instance-specific configurations.

Installation
------------

Each [release](https://github.com/wichmannpas/todoscheduler-webclient/releases) contains a built version of the client (`dist.tar.gz`).

The configuration contained used for development is built into this distribution. A (rather dirty) way of updating the configuration without needing to re-build it would be using the following commands:

    sed -i 's/http:\/\/127.0.0.1:8000/https:\/\/api.todoscheduler.org/g' dist/static/js/app*.js
    sed -i 's/John Doe\\nFoo Street 42\\n1337 Bar City\\nGermany/Your Name\\nYour Street\\n12345 Your City\\nYour Country/g' dist/static/js/app*.js

Build Setup
-----------

In order to be able to use the vuejs dev server, it is recommended to follow both the following steps and the django development server setup described in the main README.
In order to have the backend available from the vuejs dev server, a proxy like nginx could be used to pass the requests to the respective upstream.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

License
-------

Copyright 2017 Pascal Wichmann

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
