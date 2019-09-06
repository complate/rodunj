export default function Glossary({ term }, ...definitions) {
	return <dl class="glossary">
		<dt>{term}</dt>
		{definitions.map(desc => (
			<dd>{desc}</dd>
		))}
	</dl>;
}
