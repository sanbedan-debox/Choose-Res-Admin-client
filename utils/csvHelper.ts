// export class CsvHelpers {
const validStringPattern = /^[a-zA-Z0-9- ]*$/;
const invalidStringPattern = /[^a-zA-Z0-9- ]/g;
const nameLimit = 60;
const descMinLimit = 40;
const descMaxLimit = 160;

export const extractCsvFileNameFromUrl = (url: string) => {
    let paths = url.split("/");
    return paths[paths.length - 1];
};

export const sanitizeCellValue = (
    cellValue: string,
    type: "string" | "number" | "boolean"
) => {
    if (type === "string") {
        return cellValue.trim().replace(invalidStringPattern, "");
    } else if (type === "number") {
        return Number(cellValue);
    } else {
        return cellValue.trim().toLowerCase() === "true";
    }
};

export const invalidStringCellValue = (cellValue: string) => {
    let invalid = false;
    if (cellValue === "") {
        invalid = true;
    } else if (!validStringPattern.test(cellValue.trim())) {
        invalid = true;
    } else {
        invalid = false;
    }

    return invalid;
};

export const invalidNumberCellValue = (cellValue: string) => {
    try {
        let invalid = false;
        const cellNumValue = Number(cellValue);
        if (isNaN(cellNumValue)) {
            invalid = true;
        } else if (cellNumValue <= 0) {
            invalid = true;
        } else {
            invalid = false;
        }
        return invalid;
    } catch (error) {
        return false;
    }
};

export const invalidBooleanCellValue = (cellValue: string) => {
    return (
        cellValue.trim().toLowerCase() !== "true" &&
        cellValue.trim().toLowerCase() !== "false"
    );
};

export const invalidItemNameLimit = (cellValue: string) => {
    if (cellValue.length > nameLimit) {
        return true;
    }

    return false;
};

export const invalidItemDescLimit = (cellValue: string) => {
    if (
        cellValue.length < descMinLimit ||
        cellValue.length > descMaxLimit
    ) {
        return true;
    }

    return false;
};
// }
