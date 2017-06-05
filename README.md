Protolus[Beta]
--------
Protolus is a frontend agnostic application framework for rapid development of web, mobile or desktop applications using standard web technologies.

##Installation

First ensure you have [cordova](https://cordova.apache.org/docs/en/latest/guide/cli/) and [electron](https://electron.atom.io/) globally installed.

	npm install -g protolus

##Setup

All Apps require the same first steps (in this case, creating `my-project`):

	mkdir my-project
	cd my-project
	proto init

###GUI Application Setup

Then you need to tell protolus what kind of app you want to make:

	proto init <desktop|mobile:android|browser>

Next you'll need to initialize the app for your stack. Check the provided examples for a start.

+----------------------------+------------------------+
| [Polymer](docs/polymer.md) | [React](docs/react.md) |
+----------------------------+------------------------+

Last you build your application's UI logic in `interface.js`, then run it with:

	npm run <desktop|mobile:android|browser>

Now you can noodle with a working app!

###Server Application Setup

	proto init <server|webserver>

Then you edit `server.js` and add [`director` routes](https://www.npmjs.com/package/director#server-side-http-routing) to the existing code. If you initialize the app as `webserver`, you'll get some default routes enable serving the frontend (from `index.html`).

Once your routes are ready, launch the app with:

	npm run server

If you'd like to serve the files directly, without a server try [Simple REST server](docs/rest.md).

##Advanced Topics

Once you've worked on your app a little, you may find yourself wanting to do more...

###Debugging

To debug the app, you'll need to run a copy of [weinre](https://www.npmjs.com/package/weinre) which is visible from the environment the GUI is run on. Then just call `build` with `--debug <server>` (EX: `proto build desktop --debug http://localhost:8081`) and load the client.

	Now you'll have a debug session on your weinre server.

###Testing[TBD]

Testing (soon) is done through the `headless`(`test/browser.js`) and `simulation`(`test/test.js`) targets (who's purpose is browser testing and unit testing respectively).

Run either or both of these with:

	npm run tests

###Publishing

Once your app is ready, you'll want to release it to the world:

+----------------+-------------------------------------------+
| mobile:android | Play Store, Amazon, Galaxy Apps           |
| desktop        | App Store, Windows Store, Debian, Ubuntu  |
| server         | Amazon, Linux, Embedded                   |
| mobile:ios     | App Store                                 |
+----------------+-------------------------------------------+

###Programming Interface

###CLI

	proto init [desktop|web|mobile:android] //todo: support

	proto <run|build|add|use> <target> [environment]

For `add` and `use` target is the module, for `build` or `run` target is `<desktop|web|mobile:android>` and there is an additional optional `environment` setting which imports config files based on deployed location

##Testing

In the root directory run:

	npm run test

which runs the test suite directly.

##Contribution
Please make sure to run the tests before submitting a patch and report any rough edges. Thanks!

Enjoy,

-Abbey Hawk Sparrow
