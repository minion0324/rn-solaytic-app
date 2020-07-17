import axios from 'axios';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

const API_URL = 'https://staging-docgen-api.travelop.co/';

async function apiUploadFile(imageUri, imageName) {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: imageName,
    });

    return await axios.post(
      API_URL + 'api/doc-generation-job/upload-file',
      formData,
      {
        headers: {
          'Authorization': 'mWU89QAnk0ik',
          'UploadPath': `jobs/attachment/${uuid()}/`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  } catch (error) {
    console.log(error);
    console.log(error.response);

    return Promise.reject(error);
  }
};

export {
  apiUploadFile,
}
