import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';

const HTML_WEB_DIR = path.resolve(__dirname, '..', 'web');
const HTML_DIST_DIR = path.resolve(__dirname, '..', 'dist');
const TEMPLATE_TAG_REGEX = /{{\s*([\w\.]+)\s*}}/g;

const existingContents = {
  content: {
    value: 'Hello world',
    type: 'text',
  } 
};

async function getHtmlFilePaths(directory) {
  return await glob.sync(`${directory}/**/*.html`);
}

async function getFileContents(path) {
  return await fs.readFileSync(path, 'utf-8');
}

function htmlTagManager(match, tagName) {
  if (!existingContents[tagName]) {
    existingContents[tagName] = { value: match, type: 'text' };
  }
  return existingContents[tagName].value;
}

async function writeFile(filePath, fileContents) {
  await fs.ensureFileSync(filePath);
  await fs.writeFileSync(filePath, fileContents, 'utf-8');
}

async function compile() {
  // Get the .html files from the /web directory
  const htmlFilePaths = await getHtmlFilePaths(HTML_WEB_DIR);
  
  // For each path, create a promise
  const filePromises = htmlFilePaths.map(async (htmlPath) => {
    // Read the contents of the .html file
    const templatedHtml = await getFileContents(htmlPath);

    // Search for tags in the string, replace with content
    const replacedHtml = templatedHtml.replace(TEMPLATE_TAG_REGEX, htmlTagManager);

    // Recreate the folder structure in dist
    const newFilePath = HTML_DIST_DIR + htmlPath.replace(HTML_WEB_DIR, '');

    // Write the file
    writeFile(newFilePath, replacedHtml);

  });

  await Promise.all(filePromises);
}

compile();
