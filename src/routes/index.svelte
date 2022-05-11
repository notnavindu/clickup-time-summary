<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/dark.css';

	let dateRange: any;
	let apiKey: string;

	const options: any = {
		mode: 'range'
	};

	const getTime = () => {
		if (!apiKey || dateRange.length !== 2) {
			alert('Fill all fields');
		}
		console.log(dateRange, apiKey);
	};
</script>

<div class="w-full max-w-lg m-auto py-12 px-3">
	<div class="w-full">
		<input
			type="text"
			class="w-full rounded-md bg-zinc-800 p-2 outline-none color-white"
			placeholder="Clickup API Key"
			bind:value={apiKey}
		/>
	</div>

	<div class="mt-6">
		<Flatpickr
			placeholder="Select Date Range"
			class="bg-zinc-800 color-white w-full p-2"
			{options}
			bind:value={dateRange}
			name="date"
		/>
	</div>

	<button
		class="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-2 mt-6 rounded-md"
		on:click={getTime}
	>
		Get Tracked Time
	</button>
</div>
