import { instance } from "./util/instance"

export const signupApi = async (user) => {
    let signupData = {
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
        const response = await instance.post("/auth/signup", user);
        signupData = {
            isSuceess: true,
            ok: response.data,
        }
    } catch (error) {
        const response = error.response;
        signupData = {
            isSuceess: false,
            fieldErrors: response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            })),
        }
    }

    return signupData;
}