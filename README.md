[Rodunj](https://de.wikipedia.org/wiki/Rodung) /rəʊduŋ/
=======================================================

flattens [JSX](https://facebook.github.io/jsx/) tree structures by precompiling
static HTML, reducing function invocations at runtime

```jsx
<Section title={caption}>
    <dl class="glossary">
        <dt>{term}</dt>
        {definitions.map(desc => (
            <dd>{desc}</dd>
        ))}
    </dl>
</Section>
```

turns into

```javascript
[Section({ title: caption }, [
    '<dl class="glossary"><dt>', term, "</dt>",
    definitions.map(desc => ["<dd>", desc, "</dd>"]),
    "</dl>"
])]
```


Contributing
------------

* ensure [Node](http://nodejs.org) is installed
* `npm install` downloads dependencies
* `npm test` runs the test suite and checks code for stylistic consistency
