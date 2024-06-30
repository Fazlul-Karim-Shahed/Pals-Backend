
const FormData = require("form-data")



const formDataToObj = (fields) => {
    let obj = {};
    for (let key in fields) {
        if (fields.hasOwnProperty(key)) {
            // Remove '[]' from the key if it exists
            let newKey = key.replace('[]', '');
            // If the field has only one value, take the first element
            // Otherwise, keep it as an array
            obj[newKey] = fields[key].length === 1 ? fields[key][0] : fields[key];
        }
    }
    return obj;


}

module.exports.formDataToObj = formDataToObj