# Gray and Dean Research Website
The main website for Gray and Dean Research.

## Prerequisites
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)
* [Github Client ID and Secret](https://github.com/settings/developers) (for OAuth)
* [CouchDB](http://couchdb.apache.org/)

### Setup

The following databases need to be made in CouchDB

* subjects (for storing information about subjects)
* messages (for storing information from the contact form)
* answers (for storing stats about questions)

We also have a view that we run that looks like this:
```
function(doc) {
  key = doc.stage
  emit(key, {token: doc.token, phone: doc.phone});
}
```

It's saved as `_design/listings/stage`

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/operation-storefront.git
```

* Install packages (from inside the operation-storefront folder).
```
npm install
```

* Create your config.  There's a `config.json.example` file in the root.  Edit it to include all your values for the site and your OAuth information.  Save it as `config.json` and leave it in the root.

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.

* Start it up.
```
npm start
```

* Enjoy!
