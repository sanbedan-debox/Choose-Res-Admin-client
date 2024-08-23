
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


// CHECK FOR VALID NAME

export const isValidNameAlphabetic = (name: string) => {
    const regex = /^[a-zA-Z0-9\s-]+$/;
    return regex.test(name);
}

// GENERATE DUPLICATE NAMES FOR MENU BUILDER

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




// HIDE/HASH PERSONAL INFORMATION

export const hideEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return local.replace(/.(?=.{3})/g, '*') + '@' + domain;
};

export const hidePhoneNumber = (phone: string) => {
    return phone.replace(/\d(?=\d{4})/g, '*');
};


export const hideEIN = (ein: string) => {
    return ein.replace(/\d{4}$/, '****');
};


