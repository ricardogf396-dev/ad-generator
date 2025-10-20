export function fitSize(
    imgW: number,
    imgH: number,
    maxW: number,
    maxH: number,
    pad = 0
) {
    const mw = Math.max(1, maxW - pad * 2);
    const mh = Math.max(1, maxH - pad * 2);
    const r = Math.min(mw / imgW, mh / imgH);
    return { w: Math.round(imgW * r), h: Math.round(imgH * r) };
}

export function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result));
        fr.onerror = rej;
        fr.readAsDataURL(blob);
    });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
    });
}
