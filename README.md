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

## How to Use it as a Library

This Application only allows three functions those are:

1. Create
2. Read
3. Delete

### <strong>Create</strong>

<strong>This function only supports POST method</strong>, this method only accepts JSON format. The Key should always be a string capped at 32chars and value is always JSON capped at 16KB. Create cannot be invoked for an existing key. If key is already present in the datastore then appropriate message is shown.

This Method can be imported from CRD library as

```javascript
const CRD = require("./CRD/CRD");
CRD.Create(key_to_be_inserted, data_path_of_your_datastore);
```

### <strong>Read</strong>

<strong>This function only supports GET method</strong>, this method accepts key from the user and searches for the key in the DataStore and returns the value for the key, if not found then appropriate message is shown. If any value has `Time-To-Live` property, Once the Time-To-Live for a key has expired,
the key will no longer be available for Read or Delete operations.

This Method can be imported from CRD library as

```javascript
const CRD = require("./CRD/CRD");
CRD.Read(key_to_be_searched, data_path_of_your_datastore);
```

### <strong>Delete</strong>

<strong>This function only supports DELETE method</strong>, this method accepts key from the user and searches for the key in the DataStore and deletes the value for the key, if not found then appropriate message is shown.. If any value has `Time-To-Live` property, Once the Time-To-Live for a key has expired,
the key will no longer be available for Read or Delete operations.

This Method can be imported from CRD library.

```javascript
const CRD = require("./CRD/CRD");
CRD.Delete(key_to_be_deleted, data_path_of_your_datastore);
```

## How to use it as an API

API supports three function those are

1. `GET` => This method is used to <strong>read</strong> the data from datastore using the key.
2. `POST` => This method is used to <strong>create</strong> and store data into datastore.
3. `DELETE` => This method is used to <strong>delete</strong> the data from datastore using the key.

### Note:

The following are not allowed in the application

1. Use appropriate method for CRD, that is `GET` is used for <strong>Read</strong> function, `POST` is used for <strong>Create</strong> function and `DELETE` is used for <strong>Delete</strong> function. if any other method is used it will show you the help page.
2. Please use a valid directory of your datastore.
3. If an absolute path is given then the file name should have `.json` extension.

### <strong>Create</strong> using API

This API gives you flexibility to use the API in two ways, those are:

1. `http://localhost:3000/create/<JSON_Data>`
2. `http://localhost:3000/create?key=<JSON_Data>`

Either of the above options can be used. If any incorrect way is used then it will automatically direct you to the help page.

### <strong>Read</strong> using API

This API gives you flexibility to use the API in two ways, those are:

1. `http://localhost:3000/read/<The_key_to_be_read>`
2. `http://localhost:3000/read?key=<The_key_to_be_read>`

Either of the above options can be used. If any incorrect way is used then it will automatically direct you to the help page.

### <strong>Delete</strong> using API

This API gives you flexibility to use the API in two ways, those are:

1. `http://localhost:3000/delete/<The_key_to_be_deleted>`
2. `http://localhost:3000/delete?key=<The_key_to_be_deleted>`

Either of the above options can be used. If any incorrect way is used then it will automatically direct you to the help page.
