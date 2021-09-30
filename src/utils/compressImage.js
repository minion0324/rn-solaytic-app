import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from '../constants';

export const compressImage = async (imageFile) => {
    if (Platform.OS === 'android') {
        image = await ImageResizer.createResizedImage(
            imageFile.uri,
            MAX_IMAGE_WIDTH,
            MAX_IMAGE_HEIGHT,
            'JPEG',
            IMAGE_COMPRESS_QUALITY,
        );
    } else {
        image = await ImageResizer.createResizedImage(
            imageFile.uri,
            MAX_IMAGE_WIDTH,
            MAX_IMAGE_HEIGHT,
            'JPEG',
            IMAGE_COMPRESS_QUALITY,
            0,
            RNFS.TemporaryDirectoryPath
        );
        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()}.jpg`;
        await RNFS.copyFile(image.uri, dest);
    }
    return image
}