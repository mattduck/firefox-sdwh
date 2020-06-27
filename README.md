# super dumb web highlighter

A simple Firefox extension to make ephemeral text highlights and copy them to the
clipboard.

![Highlight examble](./screenshot-1.jpg)


## Background

When I'm reading technical books on paper, I sometimes highlight key takeaways
as I go, and then come back to write notes summarising the highlighted parts. I
want to be able to do this for long web pages.

There are some existing extensions for Firefox
(eg. [Textmarker](https://addons.mozilla.org/en-US/firefox/addon/textmarkerpro/)),
but they tend to either:

1. have a lot of features that I don't want to manage,

2. not have keyboard shortcuts, or

3. have very few users, in which case I prefer not to provide the wide
   permissions that these features require.


## Features

- Copy the selected text: `Ctrl + Shift + L`, or right click > "highlight selection"
- Copy all highlights to the clipboard: `Ctrl + Shift + ;`, or right click > "copy all selections"


## Build

Use `make` to package up the zip file. This can be installed from file on
Firefox Developer Edition.


## Releases

As of [2020-06-27] I'm using this myself, but am holding off on listing it on
https://addons.mozilla.org/ until I've fixed a couple of issues.
