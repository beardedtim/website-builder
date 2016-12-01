#Website Builder

> Don't talk about it, be about it.

This is the base for converting from JSON into HTML and vice-versa. This will just be the conversion between the two while the scrapping and such will be done elsewhere. 

This is a **Work In Progress** Right now `Reader` from `index.babel.js` has two main methods on it `.toHTML`, which takes in the type of object that `.toJSON` returns. The name `toJSON` is not actually correct because it is just an object and not actually a JSON object...but...oh well.

You can follow along how we do this but basically converting from the JS object to HTML was easy. The hard part came in when we try to take HTML string and make the JS object out of it. Right now we are doing it pretty cheaply and do not have integration for self-closing tags. However, self-closing tags will be easy to parse now that we have a list of strings and just need to inject that into the string.


##How Does toJSON Work?

There is alot of things going on but basically, we first find the first closing tag we can find. We then say that whatever that was is now a symbol inside of the string. We do this over and over again until we are left with the root div with a single symbol inside of it. 

Once we have that, we start creating the node tree based off of the dictionary of symbols. Because of this, we are getting a failing test on how we thought `Reader.flattenChildren`would work. This needs to be fixed.


##Install

How to install this project

```
$ git clone git@github.com:beardedtim/website-builder.git my-app

$ cd my-app

$ yarn install

// If you want to use NVM and node 7.*/npm 3.*
// https://github.com/creationix/nvm
$ nvm use

$ yarn run start
```


##Tests

TDD is our goal here. So let's use Mocha and Chai for our testing because that's what we do. We are also following the *.spec.* idea.

_**Test Directory**_

`./tests/`

_**Running Tests**_

```
$ yarn run test

// OR to watch

$ yarn run test:w
```

#Contribution

Many hands make for light work. Just don't be a doo-doo head.

#License

MIT. It might be broken but you can use it if you tell everyone else that it might be broken too. Basically. Check [LICENSE](./LICENSE.md) for more details