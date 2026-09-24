const { put, del } = require("@vercel/blob");

function enabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function saveFile(pathname, body, contentType) {
  const blob = await put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    contentType,
    allowOverwrite: true,
  });
  return blob.url;
}

async function deleteFile(url) {
  if (!enabled() || !String(url).includes(".public.blob.vercel-storage.com")) return;
  await del(url.split("?")[0]);
}

module.exports = { enabled, saveFile, deleteFile };
