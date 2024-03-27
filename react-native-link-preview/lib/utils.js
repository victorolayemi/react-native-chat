import { decode } from 'html-entities';
import { Image } from 'react-native';
export const getActualImageUrl = (baseUrl, imageUrl) => {
    let actualImageUrl = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.trim();
    if (!actualImageUrl || actualImageUrl.startsWith('data'))
        return;
    if (actualImageUrl.startsWith('//'))
        actualImageUrl = `https:${actualImageUrl}`;
    if (!actualImageUrl.startsWith('http')) {
        if (baseUrl.endsWith('/') && actualImageUrl.startsWith('/')) {
            actualImageUrl = `${baseUrl.slice(0, -1)}${actualImageUrl}`;
        }
        else if (!baseUrl.endsWith('/') && !actualImageUrl.startsWith('/')) {
            actualImageUrl = `${baseUrl}/${actualImageUrl}`;
        }
        else {
            actualImageUrl = `${baseUrl}${actualImageUrl}`;
        }
    }
    return actualImageUrl;
};
export const getHtmlEntitiesDecodedText = (text) => {
    const actualText = text === null || text === void 0 ? void 0 : text.trim();
    if (!actualText)
        return;
    return decode(actualText);
};
export const getContent = (left, right, type) => {
    var _a;
    const contents = {
        [left.trim()]: right,
        [right.trim()]: left,
    };
    return (_a = contents[type]) === null || _a === void 0 ? void 0 : _a.trim();
};
export const getImageSize = (url) => {
    return new Promise((resolve, reject) => {
        Image.getSize(url, (width, height) => {
            resolve({ height, width });
        }, 
        // type-coverage:ignore-next-line
        (error) => reject(error));
    });
};
// Functions below use functions from the same file and mocks are not working
/* istanbul ignore next */
export const getPreviewData = async (text, requestTimeout = 5000) => {
    var _a, _b;
    const previewData = {
        description: undefined,
        image: undefined,
        link: undefined,
        title: undefined,
    };
    try {
        const textWithoutEmails = text.replace(REGEX_EMAIL, '').trim();
        if (!textWithoutEmails)
            return previewData;
        const link = (_a = textWithoutEmails.match(REGEX_LINK)) === null || _a === void 0 ? void 0 : _a[0];
        if (!link)
            return previewData;
        let url = link;
        if (!url.toLowerCase().startsWith('http')) {
            url = 'https://' + url;
        }
        // eslint-disable-next-line no-undef
        let abortControllerTimeout;
        const abortController = new AbortController();
        const request = fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            },
            signal: abortController.signal,
        });
        abortControllerTimeout = setTimeout(() => {
            abortController.abort();
        }, requestTimeout);
        const response = await request;
        clearTimeout(abortControllerTimeout);
        previewData.link = url;
        const contentType = (_b = response.headers.get('content-type')) !== null && _b !== void 0 ? _b : '';
        if (REGEX_IMAGE_CONTENT_TYPE.test(contentType)) {
            const image = await getPreviewDataImage(url);
            previewData.image = image;
            return previewData;
        }
        const html = await response.text();
        // Some pages return undefined
        if (!html)
            return previewData;
        const head = html.substring(0, html.indexOf('<body'));
        // Get page title
        const title = REGEX_TITLE.exec(head);
        previewData.title = getHtmlEntitiesDecodedText(title === null || title === void 0 ? void 0 : title[1]);
        let matches;
        const meta = [];
        while ((matches = REGEX_META.exec(head)) !== null) {
            meta.push([...matches]);
        }
        const metaPreviewData = meta.reduce((acc, curr) => {
            // Verify that we have property/name and content
            // Note that if a page will specify property, name and content in the same meta, regex will fail
            if (!curr[2] || !curr[3])
                return acc;
            // Only take the first occurrence
            // For description take the meta description tag into consideration
            const description = !acc.description &&
                (getContent(curr[2], curr[3], 'og:description') ||
                    getContent(curr[2], curr[3], 'description'));
            const ogImage = !acc.imageUrl && getContent(curr[2], curr[3], 'og:image');
            const ogTitle = !acc.title && getContent(curr[2], curr[3], 'og:title');
            return {
                description: description
                    ? getHtmlEntitiesDecodedText(description)
                    : acc.description,
                imageUrl: ogImage ? getActualImageUrl(url, ogImage) : acc.imageUrl,
                title: ogTitle ? getHtmlEntitiesDecodedText(ogTitle) : acc.title,
            };
        }, { title: previewData.title });
        previewData.description = metaPreviewData.description;
        previewData.image = await getPreviewDataImage(metaPreviewData.imageUrl);
        previewData.title = metaPreviewData.title;
        if (!previewData.image) {
            let imageMatches;
            const tags = [];
            while ((imageMatches = REGEX_IMAGE_TAG.exec(html)) !== null) {
                tags.push([...imageMatches]);
            }
            let images = [];
            for (const tag of tags
                .filter((t) => !t[1].startsWith('data'))
                .slice(0, 5)) {
                const image = await getPreviewDataImage(getActualImageUrl(url, tag[1]));
                if (!image)
                    continue;
                images = [...images, image];
            }
            previewData.image = images.sort((a, b) => b.height * b.width - a.height * a.width)[0];
        }
        return previewData;
    }
    catch (_c) {
        return previewData;
    }
};
/* istanbul ignore next */
export const getPreviewDataImage = async (url) => {
    if (!url)
        return;
    try {
        const { height, width } = await getImageSize(url);
        const aspectRatio = width / (height || 1);
        if (height > 100 && width > 100 && aspectRatio > 0.1 && aspectRatio < 10) {
            const image = { height, url, width };
            return image;
        }
    }
    catch (_a) { }
};
export const oneOf = (truthy, falsy) => (...args) => {
    return truthy ? truthy(...args) : falsy;
};
export const REGEX_EMAIL = /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
export const REGEX_IMAGE_CONTENT_TYPE = /image\/*/g;
// Consider empty line after img tag and take only the src field, space before to not match data-src for example
export const REGEX_IMAGE_TAG = /<img[\n\r]*.*? src=["'](.*?)["']/g;
export const REGEX_LINK = /((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/i;
// Some pages write content before the name/property, some use single quotes instead of double
export const REGEX_META = /<meta.*?(property|name)=["'](.*?)["'].*?content=["'](.*?)["'].*?>/g;
export const REGEX_TITLE = /<title.*?>(.*?)<\/title>/g;
//# sourceMappingURL=utils.js.map