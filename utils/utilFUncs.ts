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

    if (decimalPart === 0) {
        return price;
    } else if (decimalPart < 0.50) {
        return Math.floor(price) + 0.49;
    } else {
        return Math.floor(price) + 0.99;
    }
};




export const isValidNameAlphabetic = (name: string) => {
    const regex = /^[a-zA-Z0-9\s-]+$/;
    return regex.test(name);
}

export const generateUniqueName = (baseName: string): string => {
    const nameWithoutSuffix = baseName.replace(/\s*-copy(\d*)\s*$/, '').trim();

    const hasCopySuffix = /-copy(\d*)$/.test(baseName);

    if (!hasCopySuffix) {
        return `${nameWithoutSuffix}-copy`;
    }

    const currentSuffix = (baseName.match(/-copy(\d*)$/) || [])[1];
    const nextSuffix = currentSuffix ? parseInt(currentSuffix, 10) + 1 : 2;

    return `${nameWithoutSuffix}-copy${nextSuffix}`;
};

