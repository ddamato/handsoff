import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import MarkdownIt from 'markdown-it';

const HTML_WEB_DIR = path.resolve(__dirname, '..', 'web');
const HTML_DIST_DIR = path.resolve(__dirname, '..', 'dist');
const DATABASE_JSON_PATH = path.resolve(__dirname, '..', 'gen', 'database.json');
const TEMPLATE_TAG_REGEX = /{{\s*([\w\.]+)\s*}}/g;

const md = new MarkdownIt({ html: true });

function getHtmlFilePaths(directory) {
  return glob.sync(`${directory}/**/*.html`);
}

function getFileContents(path) {
  return fs.readFileSync(path, 'utf-8');
}

function writeFile(filePath, fileContents) {
  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, fileContents, 'utf-8');
}

function copyWebFiles() {
  fs.copySync(HTML_WEB_DIR, HTML_DIST_DIR, { overwrite: true });
}

function initTag(value) {
  return {
    value,
    pages: [],
  };
}

function prepareActive(database) {
  for (const tag in database) database[tag].active = false;
}

function purgeInactive(database) {
  for (const tag in database) !database[tag].active && delete database[tag];
}

export default function compile(purge) {
  let database = {};
  try {
    // Get the existing data
    database = require(DATABASE_JSON_PATH);
  } catch (err) {
    // First time running; build the database later
    console.info(`Awaiting at ${DATABASE_JSON_PATH}`);
  }

  // Prepare to check active tags
  prepareActive(database);

  // Copy web files to /dist
  copyWebFiles();

  // Get the .html files from the /web directory
  const htmlFilePaths = getHtmlFilePaths(HTML_WEB_DIR);
  
  // For each path, create a promise
  htmlFilePaths.forEach((htmlPath) => {
    // Create new file path
    const newFilePath = htmlPath.replace(HTML_WEB_DIR, '');

    // Read the contents of the .html file
    const templatedHtml = getFileContents(htmlPath);

    // Search for tags in the string, replace with content
    const replacedHtml = templatedHtml.replace(TEMPLATE_TAG_REGEX, (match, tagName) => {

      // If the tag isn't in the database, init it
      if (!database[tagName]) {
        database[tagName] = initTag(match);
      }
      
      // Set active to true for purging
      database[tagName].active = true;

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

  // Remove inactive tags
  if (purge) {
    purgeInactive(database);
  }

  // Save updated database
  writeFile(DATABASE_JSON_PATH, JSON.stringify(database));

  // Console output for make-runnable
  return `Database built at ${DATABASE_JSON_PATH}`;
}

require('make-runnable/custom')({
  printOutputFrame: false
});
