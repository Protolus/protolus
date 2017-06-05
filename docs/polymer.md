##A Simple Polymer App

Here we'll just implement the sample [`Getting Started`](https://polymerelements.github.io/app-layout/templates/getting-started/) application from the [Polymer](https://www.polymer-project.org/2.0/docs/devguide/feature-overview)  component [app-layout](https://github.com/PolymerElements/app-layout/)'s [source](https://github.com/PolymerElements/app-layout/blob/master/templates/getting-started/x-app.html).

Once you've initialized your project, then you'll need to:

	proto add -t bower polymer
	proto add -t bower iron-icons
	proto add -t bower paper-icon-button
	proto add -t bower app-layout
	proto use app-layout/app-drawer-layout
	proto use app-layout/app-drawer
	proto use app-layout/app-scroll-effects
	proto use app-layout/app-header
	proto use app-layout/app-header-layout
	proto use app-layout/app-toolbar
	proto use app-layout/demo/sample-content
	proto add async -D

Next you'll need to edit `index.html` and add some html to the `<body>`

	<style>
		app-header {
			background-color: #00897B;
			color: #fff;
		}
		paper-icon-button {
			--paper-icon-button-ink-color: white;
		}
		app-drawer-layout:not([narrow]) [drawer-toggle] {
			display: none;
		}
	</style>
	<app-drawer-layout>
		<app-drawer slot="drawer">
			<app-toolbar>Getting Started</app-toolbar>
		</app-drawer>
		<app-header-layout>
			<app-header slot="header" reveals effects="waterfall">
				<app-toolbar>
					<paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
					<div main-title>Title</div>
				</app-toolbar>
			</app-header>
			<sample-content size="100"></sample-content>
		</app-header-layout>
	</app-drawer-layout>

Then launch the app. You are done.
