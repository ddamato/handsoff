# handsoff
I wanted to create a CMS that was based off of [Vapid's idea](https://medium.com/@hellovapid/hello-vapid-db3709ad5b82), just without the all the errors when trying to install. **handsoff** is an attempt to make it super simple to manage a small site using a CMS that is generated with the template tags found in the HTML files. In a way, it's a really simple static site generator because the files you supply are nearly static from the beginning. 😎

## Quick start
* Clone this repo (`git clone git@github.com:ddamato/handsoff.git`)
* Create your files for the web into the `./web` directory; replacing the example that is currently there (donniedamato.info).
* Add template tags (`{{ example }}`) to your `.html` files where you want content to be.
* Open up the terminal, navigate to this project's folder and run `npm start`.
* Navigate to `http://localhost:9000` in your web browser to access the CMS.
* Update the tag content by clicking a tag in the navigation, and use the inline editor. Changes are saved automatically.
* When you're ready to view the changes in your site, click the "Build Site" button.
* Your site assets will be ready in the `./dist` folder of the project. You can copy these files to the internet for hosting in any way you like.

## Package scripts
| Command | Description |
|------- | ----------- |
| `npm run compile` | Go through the `.html` files in the `./web` directory for template tags and replace with content. Also move all other files into the `./dist` directory. |
| `npm run compile:purge` | Same as `npm run compile` except all unused template tags are removed from storage. |
| `npm run cms` | Start the server for the CMS. It'll be located at `http://localhost:9000`. |
| `npm run start` | Runs both `npm run watch` and `npm run cms` |
| `npm run watch` | Listens for changes to the `./web` directory and recompiles the files for the `./dist`. The local version of the page you are working on can then be reloaded to see new content. |

## Writing your tags
You can write simple [mustache](https://mustache.github.io/) / [handlebars](https://handlebarsjs.com/) / [nunjucks](https://mozilla.github.io/nunjucks/) style template tags using double curly braces (`{{}}`). There are no special tag for conditionals, loops, functions, etc. The compiler will just write text and HTML. Tags can be written freely within the braces and there's no depth to the tags.  The following are all different ways to writing different tags.

* `{{ myGreatTag }}`
* `{{ my_great_tag }}`
* `{{ my-great-tag }}`
* `{{ my.great.tag }}`

## CMS / Editor
<img src="https://cdn-images-1.medium.com/max/1600/1*IEwU-uK5W-WVoYZx_88TTg.png"/>

Use the links on the left to navigate to different tags. The editor accepts markdown and HTML. If you add only a single line of text, the output will be inline (no wrapped `<p>` tag). A list of pages that the tag can be found on is listed just above the editor.