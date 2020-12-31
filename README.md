# DataStore_Assessment

## Problem Statement

Build a file-based key-value data store that supports the basic CRD (create, read, and delete) operations. This data store is meant to be used as a local storage for one single process on one laptop. The data store must be exposed as a library to clients that can instantiate a class and work with the data store.

## About

1. This Project uses NodeJS, which can be found [here](https://nodejs.org/en/download/)
2. Used Express JS Framework to create the API, [more](https://expressjs.com/)

## Setup

1. Download or Clone this Repository
2. Run this command `npm install` , This will install all the dependencies.
3. To run the application all you have to type is `npm start` or `npm start <absolute_path_datastore>`

## How to Use as Library

This Application only allows three methods those are:

1. Create
2. Read
3. Delete

### Create

<strong>This method only supports POST method</strong>, this method only accepts JSON format. The Key should always be a string capped at 32chars and value is always JSON capped at 16KB. Create cannot be invoked for an existing key.

This Method can be imported from CRD library as

```javascript
const CRD = require("./CRD/CRD");
CRD.Create(key_to_be_inserted, data_path_of_your_datastore);
```

### Read

<strong>This method only supports GET method</strong>, this method accepts key from the user and searches for the key in the DataStore and returns the value for the key, if not key found then appropriate message is shown. If any value has `Time-To-Live` property, Once the Time-To-Live for a key has expired,
the key will no longer be available for Read or Delete operations.

This Method can be imported from CRD library as

```javascript
const CRD = require("./CRD/CRD");
CRD.Read(key_to_be_searched);
```

### Delete

<strong>This method only supports DELETE method</strong>, this method accepts key from the user and searches for the key in the DataStore and deletes the value for the key, if not key found then appropriate message is shown.. If any value has `Time-To-Live` property, Once the Time-To-Live for a key has expired,
the key will no longer be available for Read or Delete operations.

This Method can be imported from CRD library.

```javascript
const CRD = require("./CRD/CRD");
CRD.Delete(key_to_be_deleted);
```
