[Rodunj](https://de.wikipedia.org/wiki/Rodung) /rəʊduŋ/
=======================================================

optimizes [JSX](https://facebook.github.io/jsx/) by precompiling static HTML,
reducing cycles required at runtime

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

is converted to plain JavaScript:

```javascript
[
    Section({ title: caption },
            '<dl class="glossary"> <dt>',
            term,
            "</dt>",
            definitions.map(desc => [
                "<dd>", desc, "</dd>"
            ]),
            "</dl>")
]
```

(approximation for readability)


Contributing
------------

* ensure [Node](http://nodejs.org) is installed
* `npm install` downloads dependencies
* `npm test` runs the test suite and checks code for stylistic consistency
