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

export const generateUniqueName = (baseName: string): string => {
    // Remove any existing (copy) suffix and trim the base name
    const nameWithoutSuffix = baseName.replace(/\s*\(copy(\d*)\)\s*$/, '').trim();

    // Check if the base name already has a suffix
    const hasCopySuffix = /\(copy(\d*)\)$/.test(baseName);

    // If there is no suffix, start with (copy)
    if (!hasCopySuffix) {
        return `${nameWithoutSuffix} (copy)`;
    }

    // Extract the current suffix number
    const currentSuffix = (baseName.match(/\(copy(\d*)\)$/) || [])[1];
    const nextSuffix = currentSuffix ? parseInt(currentSuffix, 10) + 1 : 2;

    return `${nameWithoutSuffix} (copy${nextSuffix})`;
};
