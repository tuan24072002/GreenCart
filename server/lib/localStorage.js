import { copyFileSync, mkdirSync, unlinkSync } from 'fs';

export const uploadImage = (file) => {
    const date = Date.now();
    let fileDir = `./uploads/files/${date}`;
    let fileName = `${fileDir}/${file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    copyFileSync(file.path, fileName);
    unlinkSync(file.path);
    return fileName;
}
