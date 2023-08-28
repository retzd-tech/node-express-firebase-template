const { getDownloadURL } = require("firebase-admin/storage");

const initilizedFirebase = require("./../connector/init");

const collections = {
  MEMBERS: "members",
  GALLERIES: "galleries",
};

const { firestore, firebaseStorage } = initilizedFirebase;

const getUploadedImageListOnce = async () => {
  try {
    const images = [];
    await firestore
      .collection(collections.GALLERIES)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var key = doc.id;
          const image = {
            id: key,
            ...doc.data(),
          };
          images.push(image);
        });
      });
      await firestore
      .collection('test')
      .add({ key: 'value'});
    return images;
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};

const getAllUploadedImagesURL = async () => {
  const images = await getUploadedImageListOnce();
  const imageURLs = [];
  for (let i = 0; i < images?.length; i++) {
    const url = await getUploadedImageURL(images[i].path);
    imageURLs.push({ ...images[i], url });
  }
  return imageURLs;
};

const getUploadedImageURL = async (path) => {
  const storageRef = await firebaseStorage
    .bucket("qode-8795d.appspot.com")
    .getFiles(path);
  try {
    return await getDownloadURL(storageRef[0][0]);
  } catch (error) {
    console.log("get error", error, path);
  }
};

const operation = {
  getAllUploadedImagesURL
};

module.exports = operation;