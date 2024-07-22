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


//Price Round Off

export const roundOffPrice = (price: number) => {
    const decimalPart = price % 1;

    if (decimalPart <= 0.29) {
        return Math.floor(price) + 0.49;
    } else if (decimalPart <= 0.70) {
        return Math.floor(price) + 0.99;
    } else {
        return Math.ceil(price);
    }
};


export const isValidNameAlphabetic = (name: string) => {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(name);
}