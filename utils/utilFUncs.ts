export const formatWebsiteUrlClickable = (url: string) => {
    if (!url.match(/^https?:\/\//i)) {
        return `https://${url}`;
    }
    return url;
};


// errorUtils.ts

export const extractErrorMessage = (error: any): string => {
    const errorJson = JSON.parse(JSON.stringify(error));
    if (
        errorJson &&
        errorJson.response &&
        errorJson.response.errors &&
        errorJson.response.errors[0].message
    ) {
        return errorJson.response.errors[0].message.toString().replace("Error: ", "");
    } else {
        return error.toString();
    }
};
