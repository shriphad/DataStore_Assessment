const path = require('path');
const fs = require('fs');
const lockfile = require('proper-lockfile');

var exists = { "data": "Successfully inserted the value", "status": true };

const Time_to_live = (obj) => {
    const datetime = new Date();
    const created = new Date(obj["CreatedAt"]).getTime() / 1000;
    const timeToLive = obj["Time-To-Live"];
    const remaining = (created + timeToLive) - datetime;
    if (remaining <= 0) return false;
    else return true;
};

const isExists = (data, JSONdata) => {
    for (const key in data) {
        if (key in JSONdata) {
            exists["data"] = "Key is already inserted"
            exists["status"] = false;
            return (false);
        }
    }

    return true;
}

const preprocess = (key, db_path) => {

    datatype = path.extname(db_path).toLowerCase();
    datapath = path.resolve(path.dirname(db_path), path.basename(db_path, path.extname(db_path)) + datatype);
    //console.log(datapath);
    if (datatype !== ".json") {
        //console.log(datatype, typeof (datatype));
        //console.log(datapath);
        return ({
            status: false,
            data: 'Data should be in JSON format or Mention file name with .json in the given directory'
        });
    }
    else {

        try {
            //lock
            const JSONdata = require(datapath);
            //unlock
            if (JSONdata.hasOwnProperty(key)) {
                if (JSONdata[`${key}`].hasOwnProperty("Time-To-Live")) {
                    if (Time_to_live(JSONdata[`${key}`])) {
                        return ({
                            status: true,
                            data: JSONdata
                        });
                    }
                    else {
                        return ({
                            status: false,
                            data: "The Requested data has been expired"
                        });
                    }
                }
                else {
                    return ({
                        status: true,
                        data: JSONdata
                    });
                }

            }
            else {
                return ({
                    status: false,
                    data: "No Data is found with the associated key"
                });
            }
        }
        catch (err) {
            //console.log(err);
            if (err.code === "MODULE_NOT_FOUND") {
                return ({
                    status: false,
                    data: "File not found"
                });
            }
            else {
                console.log(err);
                return ({
                    status: false,
                    data: "error occured"
                });
            }
        }
    }
};


function Read(key, db_path) {
    const obj = preprocess(key, db_path);
    if (obj["status"]) {
        delete obj["data"][`${key}`]["CreatedAt"];
        return (obj["data"][`${key}`]);
    }
    else {
        return (obj["data"]);
    }
}

function Create(data, db_path) {
    datatype = path.extname(db_path).toLowerCase();
    datapath = path.resolve(path.dirname(db_path), path.basename(db_path, path.extname(db_path)) + datatype);
    try {
        data = JSON.parse(data);
    } catch (e) {
        console.log(e);
        return ("Incorrect Data format, Only JSON is accepted! or Directory not found!");
    }

    if (typeof (data) === "object") {
        const size = Object.keys(data).length;
        if (size > 1000000000)
            return ("Limit exceeded! Size of file is more than 1GB");
        for (const i in data) {
            if (typeof (i) !== "string")
                return ("Key should always be a string");
            if (i.length > 32)
                return ("Key cannot be more than 32 characters");
            try {
                data1 = JSON.parse(JSON.stringify(data[i]));
            } catch (e) {
                return ("Incorrect Data format");
            }

            if (typeof (data1) !== "object")
                return ("Value must be in a JSON format");
            const ValueSize = Object.keys(data1).length;
            if (ValueSize > 16384)
                return ("The value cannot be more than 16KB");
            const date = new Date();
            data[i]["CreatedAt"] = date;
        }

        //lock

        lockfile.lock(path.resolve(path.dirname(db_path)))
            .then((release) => {
                if (fs.existsSync(datapath)) {
                    const JSONdata = require(datapath);
                    if (isExists(data, JSONdata)) { //If key not exists
                        Object.assign(JSONdata, data);
                        const append = JSON.stringify(JSONdata);
                        fs.writeFile(datapath, append, (err) => { });
                        exists["data"] = "Successfully inserted the value";
                    }
                }
                else {
                    //console.log("create and adding");
                    const append = JSON.stringify(data);
                    fs.appendFile(datapath, append, (err) => { });
                    exists["data"] = "Successfully inserted the value";
                }

                return release();
            })
            .catch((e) => {
                //console.error(e.code)
                if (e.code === 'ENOENT') {
                    exists["data"] = "Directory Not found";
                }
            });
        //unlock


        // let returnValue = exists["data"];
        // exists["data"] = "";
        return (exists["data"]);
    }
    else {
        //console.log(typeof (JSON.parse(data)), data);
        return ('Incorrect Data format, Only JSON is accepted!')
    }

}


function Delete(key, db_path) {
    const obj = preprocess(key, db_path);
    if (obj["status"]) {
        delete obj["data"][`${key}`];
        const data = JSON.stringify(obj["data"]);
        //lock
        fs.writeFile(datapath, data, (err) => { });
        //unlock
        return ("Deleted Succussfully");
    }
    else {
        return (obj["data"]);
    }
}

module.exports = {
    Read: Read,
    Create: Create,
    Delete: Delete
}
