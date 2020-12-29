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
            const JSONdata = require(datapath);
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
        console.log(obj["data"][`${key}`]);
    }
    else {
        console.log(obj["data"]);
    }
}

function Create() {

}


function Delete(key, db_path) {
    const obj = preprocess(key, db_path);
    if (obj["status"]) {
        delete obj["data"][`${key}`];
        const data = JSON.stringify(obj["data"]);
        fs.writeFileSync(datapath, data);
        console.log("Deleted Succussfully");
        // return({

        // });
    }
    else {
        console.log(obj["data"]);
    }
}

module.exports = {
    Read: Read,
    Create: Create,
    Delete: Delete
}
