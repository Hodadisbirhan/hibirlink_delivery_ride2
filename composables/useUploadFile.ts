import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref as storageReference,
} from "firebase/storage";

export default function useFirebaseClient() {
  const uploadImages = async (files: any, path: string) => {
    const singleImageUpload = async (file: any) => {
      const storage = getStorage();
      const getStorageReference = storageReference(
        storage,
        `${path}/${file.name}`
      );
      const upload = await uploadString(
        getStorageReference,
        file.base64,
        "base64"
      );
      const url = await getDownloadURL(getStorageReference);
      return url;
    };
    try {
      const urls = await Promise.all(
        files.map(async (e: any) => {
          const url = await singleImageUpload(e);
          return url;
        })
      );
      return { urls, error: null };
    } catch (error) {
      return { urls: null, error };
    }
  };

  return {
    uploadImages,
  };
}
