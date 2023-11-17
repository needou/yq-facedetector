

/**
 * 压缩图像
 * @param base64Image
 * @param maxWidth
 * @param maxHeight
 * @param format
 * @param quality
 * @returns {Promise<unknown>}
 */
export function compressImage(base64Image, originalWidth, originalHeight, maxWidth, maxHeight, format, quality) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let newWidth, newHeight;

            const aspectRatio = originalWidth / originalHeight;

            if (originalWidth > maxWidth || originalHeight > maxHeight) {
                if (originalWidth / maxWidth > originalHeight / maxHeight) {
                    newWidth = maxWidth;
                    newHeight = maxWidth / aspectRatio;
                } else {
                    newHeight = maxHeight;
                    newWidth = maxHeight * aspectRatio;
                }
            } else {
                newWidth = originalWidth;
                newHeight = originalHeight;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(image, 0, 0, newWidth, newHeight);

            canvas.toBlob(
                function(blob) {
                    const reader = new FileReader();

                    reader.onload = function() {
                        resolve(reader.result);
                    };

                    canvas.toBlob(
                        function(blob) {
                            reader.readAsDataURL(blob);
                        },
                        format || 'image/jpeg',
                        quality || 0.8
                    );
                },
                format || 'image/jpeg',
                quality || 0.8
            );
        };

        image.onerror = function() {
            reject(new Error('Failed to load the image.'));
        };

        image.src = base64Image;
    });
}
