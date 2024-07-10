export const formatWebsiteUrlClickable = (url: string) => {
    if (!url.match(/^https?:\/\//i)) {
        return `https://${url}`;
    }
    return url;
};