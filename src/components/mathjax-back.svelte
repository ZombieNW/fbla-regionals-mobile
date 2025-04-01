<script>
	import { onMount, afterUpdate } from 'svelte';

	export let tex = '';
	let container;

	// Only run in browser
	onMount(() => {
		if (typeof window === 'undefined') return;

		// Set up MathJax if needed
		if (!window.MathJax) {
			window.MathJax = {
				tex: {
					inlineMath: [['\\(', '\\)']],
					displayMath: [['\\[', '\\]']]
				}
			};

			import('mathjax/es5/tex-mml-chtml.js');
		}
	});

	afterUpdate(() => {
		if (typeof window !== 'undefined' && window.MathJax?.typesetPromise) {
			rerender();
		}
	});

	function rerender() {
		window.MathJax.typesetPromise([container]);

		const elements = container.getElementsByTagName('mjx-container');
		setTimeout(() => {
			while (elements.length > 1) {
				container.removeChild(elements[0]);
			}
		}, 1);
	}
</script>

<div bind:this={container}>
	{@html `\\(${tex}\\)`}
</div>
