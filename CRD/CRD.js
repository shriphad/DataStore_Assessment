//Author: Shriphad Rao
const path = require('path');
const fs = require('fs');



const Time_to_live = (obj) => {
    const datetime = new Date().getTime() / 1000;
    const created = new Date(obj["CreatedAt"]).getTime() / 1000;
    const timeToLive = obj["Time-To-Live"];
    const remaining = (created + timeToLive) - datetime;
    if (remaining <= 0) return false;
    else return true;
};

const isExists = (data, JSONdata) => {
    for (const key in data) {
        if (key in JSONdata) {
            return (false);
        }
    }

    return true;
}

const preprocess = (key, db_path) => {

    const datatype = path.extname(db_path).toLowerCase();
    const datapath = path.resolve(path.dirname(db_path), path.basename(db_path, path.extname(db_path)) + datatype);
    console.log(datatype);
    if ((datatype !== ".json") && (datatype !== ".txt")) {
        return ({
            status: false,
            data: 'Data should be in JSON format or Mention file name with (.json or .txt) extention in the given directory'
        });
    }
    else {

        try {

            const JSONdata = JSON.parse(fs.readFileSync(datapath, "utf8"));
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
            if (err.code === "MODULE_NOT_FOUND") {
                return ({
                    status: false,
                    data: "File not found"
                });
            }
            else {
                return ({
                    status: false,
                    data: "File or Directory not Found"
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
        //console.log(e);
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


        if (fs.existsSync(datapath)) {
            const JSONdata = JSON.parse(fs.readFileSync(datapath, "utf8"));
            if (isExists(data, JSONdata)) { //If key not exists
                Object.assign(JSONdata, data);
                const append = JSON.stringify(JSONdata);
                fs.writeFileSync(datapath, append);
                return ("Successfully inserted the value");
            }
            else {
                return ("Key Already Present in data");
            }
        }
        else {
            if (!fs.existsSync(path.resolve(path.dirname(db_path))))
                return ("Directory not found")
            const append = JSON.stringify(data);
            fs.appendFileSync(datapath, append);
            return ("Successfully inserted the value");
        }
    }
    else {
        return ('Incorrect Data format, Only JSON is accepted!')
    }

}


function Delete(key, db_path) {
    const obj = preprocess(key, db_path);
    const datatype = path.extname(db_path).toLowerCase();
    const datapath = path.resolve(path.dirname(db_path), path.basename(db_path, path.extname(db_path)) + datatype);
    if (obj["status"]) {
        delete obj["data"][`${key}`];
        const data = JSON.stringify(obj["data"]);
        fs.writeFileSync(datapath, data);
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
