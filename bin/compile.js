import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import MarkdownIt from 'markdown-it';

const HTML_WEB_DIR = path.resolve(__dirname, '..', 'web');
const HTML_DIST_DIR = path.resolve(__dirname, '..', 'dist');
const DATABASE_JSON_PATH = path.resolve(__dirname, '..', 'gen', 'database.json');
const TEMPLATE_TAG_REGEX = /{{\s*([\w\.]+)\s*}}/g;

const md = new MarkdownIt();

async function getHtmlFilePaths(directory) {
  return await glob.sync(`${directory}/**/*.html`);
}

async function getFileContents(path) {
  return await fs.readFileSync(path, 'utf-8');
}

async function writeFile(filePath, fileContents) {
  await fs.ensureFileSync(filePath);
  await fs.writeFileSync(filePath, fileContents, 'utf-8');
}

async function copyWebFiles() {
  await fs.copySync(HTML_WEB_DIR, HTML_DIST_DIR, { overwrite: true });
}

function initTag(value) {
  return {
    value,
    pages: [],
  };
}

export default async function compile() {
  let database = {};
  try {
    // Get the existing data
    database = require(DATABASE_JSON_PATH);
    console.info(`Reading: ${DATABASE_JSON_PATH}`);
  } catch (err) {
    // First time running; build the database later
    console.info(`Building: ${DATABASE_JSON_PATH}`);
  }

  // Copy web files to /dist
  copyWebFiles();

  // Get the .html files from the /web directory
  const htmlFilePaths = await getHtmlFilePaths(HTML_WEB_DIR);
  
  // For each path, create a promise
  const filePromises = htmlFilePaths.map(async (htmlPath) => {
    // Create new file path
    const newFilePath = htmlPath.replace(HTML_WEB_DIR, '');

    // Read the contents of the .html file
    const templatedHtml = await getFileContents(htmlPath);

    // Search for tags in the string, replace with content
    const replacedHtml = templatedHtml.replace(TEMPLATE_TAG_REGEX, (match, tagName) => {

      // If the tag isn't in the database, init it
      if (!database[tagName]) {
        database[tagName] = initTag(match);
      }
      
      const { pages, value } = database[tagName];

      // If the page isn't listed in the pages key, add it
      Array.isArray(pages) && !~pages.indexOf(newFilePath) && pages.push(newFilePath);

      // If the value contains line breaks, render as full markdown
      if (/\n/.test(value)) {
        return md.render(value);
      }

      // Otherwise, render inline text
      return md.renderInline(value);
    });

    // Write the file
    writeFile(HTML_DIST_DIR + newFilePath, replacedHtml);

  });

  // Ensure all the files have been processed
  await Promise.all(filePromises);

  // Save updated database
  writeFile(DATABASE_JSON_PATH, JSON.stringify(database));
}

compile();
