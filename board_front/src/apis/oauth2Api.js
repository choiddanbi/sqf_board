import { instance } from "./util/instance";

export const oauth2MergeApi = async (user) => {

    let mergeData = {
        isSuceess: false,
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    }
    try {
        const response = await instance.post("/auth/oauth2/merge", user);
        mergeData = {
            isSuceess: true
        }
    } catch (error) {
        const response = error.response;
        
        mergeData = {
            isSuceess: false,
        }

        if(typeof(response.data) === 'string') {
            mergeData['errorStatus'] = "loginError";
            mergeData['error'] = response.data;
        }else {
            mergeData['errorStatus'] = "fieldError";
            mergeData['error'] = response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            }));
        }
    }

    return mergeData;
}