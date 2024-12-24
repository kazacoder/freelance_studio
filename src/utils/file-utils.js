export class FileUtils {
    static loadPageScript (src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        });
    }

    static loadPageStyle (src, insertBeforeElement) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.insertBefore(link, insertBeforeElement);
    }

    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Can not convert this file'));
        });
    }

    static async loadIncludes(src, includesDiv) {
        const srcHtml = await fetch(src).then(response => response.text());
        const srcNewDiv = document.createElement('div');
        srcNewDiv.innerHTML = srcHtml;
        includesDiv.appendChild(srcNewDiv)
    }
}