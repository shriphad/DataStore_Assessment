const path = require('path');
const fs = require('fs');


const Time_to_live = (obj) => {
    const datetime = new Date();
    const created = new Date(obj["CreatedAt"]).getTime() / 1000;
    const timeToLive = obj["Time-To-Live"];
    const remaining = (created + timeToLive) - datetime;
    if (remaining <= 0) return false;
    else return true;
};

const preprocess = (key, db_path) => {

    datatype = path.extname(db_path).toLowerCase();
    datapath = path.resolve(path.dirname(db_path), path.basename(db_path, path.extname(db_path)) + datatype);
    //console.log(datapath);
    if (datatype !== ".json") {
        //console.log(datatype, typeof (datatype));
        //console.log(datapath);
        return ({
            status: false,
            data: 'Data should be in JSON format'
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
    if (typeof (data) === "object") {
        const size = Object.keys(data).length;
        if (size > 1000000000)
            return ("Limit exceeded! Size of file is more than 1GB");
        for (const i in data) {
            if (typeof (i) !== "string")
                return ("Key should always be a string");
            if (i.length > 32)
                return ("Key cannot be more than 32 characters");
            if (typeof (data[i]) !== "object")
                return ("Value must be in a JSON format");
            const ValueSize = Object.keys(data[i]).length;
            if (ValueSize > 16384)
                return ("The value cannot be more than 16KB");
        }

        //lock
        fs.stat(datapath, function (err, stats) {
            if (stats.isDirectory()) {
                const JSONdata = require(datapath);
                for (let key in data) if (key in JSONdata) return ("Key is already Present in DataStore");

                fs.appendFile(datapath, data, "utf8");
            }
            else {
                console.log("create and appending");
                fs.appendFile(datapath, data, "utf8");
            }
        });

        //unlock
    }
    else {
        return ('Incorrect Data format, Only JSON is accepted!')
    }

}


function Delete(key, db_path) {
    const obj = preprocess(key, db_path);
    if (obj["status"]) {
        delete obj["data"][`${key}`];
        const data = JSON.stringify(obj["data"]);
        //lock
        fs.writeFile(datapath, data);
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
