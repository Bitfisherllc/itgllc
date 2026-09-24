const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { homeContent } = require("../lib/home-content.cjs");
const home = require("./home-store");
const library = require("./library");
const blobs = require("./blob-files");
const documents = require("./documents");

const maxBytes = 5 * 1024 * 1024;

const slots = new Set(["hero", "about", "pillar-0", "pillar-1", "pillar-2"]);

function detectType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

function reject(status, publicMessage) {
  return Object.assign(new Error(publicMessage), { status, publicMessage });
}

function versioned(src) {
  const path = src.split("?")[0];
  return `${path}?v=${Date.now()}`;
}

async function assignSlot(slot, src) {
  if (!slots.has(slot)) throw reject(400, "That image cannot be replaced.");
  const content = await home.readHome();
  const image = versioned(src);
  if (slot === "hero") {
    const previous = String(content.heroImage || "").split("?")[0];
    const nextPath = image.split("?")[0];
    content.heroImage = image;
    const rest = (content.heroSlides || []).filter((src) => {
      const pathOnly = String(src).split("?")[0];
      return pathOnly !== previous && pathOnly !== nextPath && pathOnly !== "/images/home/hero.jpg";
    });
    content.heroSlides = [image, ...rest];
  }
  else if (slot === "about") content.aboutImage = image;
  else content.pillars[Number(slot.slice("pillar-".length))].image = image;
  return home.writeHome(content);
}

async function addToLibrary(buffer) {
  if (!buffer.length || buffer.length > maxBytes) throw reject(400, "Use an image under 5 MB.");
  const extension = detectType(buffer);
  if (!extension) throw reject(400, "Use a JPEG, PNG, or WebP image.");
  await library.addImage(buffer, extension);
  return { library: await library.listImages() };
}

async function saveHomeImage(slot, buffer) {
  if (!slots.has(slot)) throw reject(400, "That image cannot be replaced.");
  if (!buffer.length || buffer.length > maxBytes) throw reject(400, "Use an image under 5 MB.");
  const extension = detectType(buffer);
  if (!extension) throw reject(400, "Use a JPEG, PNG, or WebP image.");
  const saved = await library.addImage(buffer, extension);
  const content = await assignSlot(slot, saved.src);
  return { content, library: await library.listImages() };
}

async function chooseHomeImage(slot, id) {
  const image = await library.findImage(id);
  if (!image) throw reject(400, "That library image was not found.");
  const content = await assignSlot(slot, image.src);
  return { content, library: await library.listImages() };
}

async function deleteLibraryImage(id) {
  const image = await library.findImage(id);
  if (!image) throw reject(400, "That library image was not found.");
  const removed = await library.removeImage(id);
  if (!removed) throw reject(400, "That library image was not found.");
  const content = await home.readHome();
  const removedPath = image.src.split("?")[0];
  let changed = false;
  const remainingSlides = (content.heroSlides || []).filter((src) => src.split("?")[0] !== removedPath);
  if (remainingSlides.length !== content.heroSlides.length) {
    content.heroSlides = remainingSlides;
    changed = true;
  }
  if (content.heroImage.split("?")[0] === removedPath) {
    const nextPhotograph = remainingSlides.find((src) => !src.split("?")[0].endsWith(".mp4"));
    content.heroImage = nextPhotograph || homeContent.heroImage;
    changed = true;
  }
  if (content.aboutImage.split("?")[0] === removedPath) {
    content.aboutImage = homeContent.aboutImage;
    changed = true;
  }
  content.pillars.forEach((pillar, index) => {
    if (pillar.image.split("?")[0] === removedPath) {
      pillar.image = homeContent.pillars[index].image;
      changed = true;
    }
  });
  const saved = changed ? await home.writeHome(content) : content;
  const pagesStore = require("./pages-store");
  await pagesStore.clearPageImage(removedPath);
  return { content: saved, library: await library.listImages() };
}

function sanitizeSvg(buffer) {
  const text = buffer.toString("utf8").replace(/^\uFEFF/, "").trim();
  if (!/^<svg[\s>]/i.test(text.replace(/<\?xml[\s\S]*?\?>/i, "").trim()) || !/<\/svg>\s*$/i.test(text)) {
    throw reject(400, "Use an SVG file.");
  }
  if (/<script|<\/script|foreignObject|<iframe|<embed|<object|<!ENTITY|javascript:|data:text\/html|expression\s*\(|@import|\son[a-z]+\s*=/i.test(text)) {
    throw reject(400, "This SVG includes content the site cannot use. Export a plain SVG.");
  }
  return Buffer.from(text, "utf8");
}

async function saveHeroLogo(buffer) {
  if (!buffer.length || buffer.length > 512 * 1024) throw reject(400, "Use an SVG under 512 KB.");
  const svg = sanitizeSvg(buffer);
  const id = crypto.createHash("sha256").update(svg).digest("hex").slice(0, 16);
  const name = `${id}.svg`;
  const content = await home.readHome();
  if (blobs.enabled()) {
    const url = await blobs.saveFile(`logo/custom/${name}`, svg, "image/svg+xml");
    content.heroLogo = `${url}?v=${Date.now()}`;
  } else {
    const folders = [path.join(__dirname, "..", "public", "logo", "custom")];
    if (fs.existsSync(path.join(__dirname, "..", "out"))) folders.push(path.join(__dirname, "..", "out", "logo", "custom"));
    for (const folder of folders) {
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, name), svg);
    }
    content.heroLogo = `/logo/custom/${name}?v=${Date.now()}`;
  }
  return { content: await home.writeHome(content) };
}

function animationFolders() {
  const folders = [path.join(__dirname, "..", "public", "logo", "ANIMATIONS")];
  if (fs.existsSync(path.join(__dirname, "..", "out"))) {
    folders.push(path.join(__dirname, "..", "out", "logo", "ANIMATIONS"));
  }
  return folders;
}

function animationFileName(original, svg) {
  const base = path.basename(String(original || "")).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  if (/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.svg$/i.test(base)) return base;
  const id = crypto.createHash("sha256").update(svg).digest("hex").slice(0, 16);
  return `animation-${id}.svg`;
}

async function saveAnimation(buffer, originalName) {
  if (!buffer.length || buffer.length > 1024 * 1024) throw reject(400, "Use an SVG under 1 MB.");
  const svg = sanitizeSvg(buffer);
  const name = animationFileName(originalName, svg);
  if (blobs.enabled()) {
    const url = await blobs.saveFile(`logo/animations/${name}`, svg, "image/svg+xml");
    const current = await documents.readJson("animations");
    const logos = Array.isArray(current) ? current : [];
    if (!logos.some((item) => item.src === url)) {
      logos.push({
        src: url,
        label: name.replace(/\.svg$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      });
      await documents.writeJson("animations", logos);
    }
    return { src: url };
  }
  const primary = animationFolders()[0];
  const destination = path.join(primary, name);
  if (fs.existsSync(destination)) {
    const current = fs.readFileSync(destination);
    if (!current.equals(svg)) {
      const id = crypto.createHash("sha256").update(svg).digest("hex").slice(0, 8);
      const stem = name.replace(/\.svg$/i, "");
      return saveNamedAnimation(svg, `${stem}-${id}.svg`);
    }
  }
  return saveNamedAnimation(svg, name);
}

function saveNamedAnimation(svg, name) {
  for (const folder of animationFolders()) {
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, name), svg);
  }
  return { src: `/logo/ANIMATIONS/${name}` };
}

async function deleteAnimationFile(src) {
  if (String(src).startsWith("https://")) {
    await blobs.deleteFile(src);
    if (documents.enabled()) {
      const current = await documents.readJson("animations");
      const logos = Array.isArray(current) ? current.filter((item) => item.src !== src) : [];
      await documents.writeJson("animations", logos);
    }
    return;
  }
  const name = path.basename(String(src || ""));
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.svg$/.test(name)) {
    throw reject(400, "That animation was not found.");
  }
  const primary = path.join(animationFolders()[0], name);
  if (!fs.existsSync(primary)) throw reject(400, "That animation was not found.");
  for (const folder of animationFolders()) {
    const file = path.join(folder, name);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

module.exports = {
  saveHomeImage,
  chooseHomeImage,
  deleteLibraryImage,
  addToLibrary,
  saveHeroLogo,
  saveAnimation,
  deleteAnimationFile,
  maxBytes,
};
