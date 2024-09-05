import { instance } from "./util/instance"

export const oauth2SubmitApi = async (user) => {

    let submitData = {
        isSuceess: false,
        ok: {
            message: "",
            user: null
        },
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    }
    try {
        const response = await instance.post("/auth/oauth2/signup", user);
        submitData = {
            isSuceess: true,
            ok: response.data,
        }
    } catch(error) {
        const response = error.response;
        submitData = {
            isSuceess: false,
            fieldErrors: response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            })),
        }
    }

    return submitData;
}