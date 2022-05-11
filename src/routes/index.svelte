<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/dark.css';
	import { getListDetails, getTrackedTime } from '$lib/api';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';

	let cached: any;
	let dateRange: any;
	let apiKey: string;
	let workspaceId: string;

	let trackedTime: any;

	const options: any = {
		mode: 'range'
	};

	onMount(() => {
		if (browser) {
			cached = localStorage.getItem('cached');

			if (cached) {
				cached = JSON.parse(cached);
				apiKey = cached?.apiKey || '';
				workspaceId = cached?.workspaceId || '';
			}
		}
	});

	const getTime = () => {
		if (!apiKey || dateRange.length !== 2) {
			alert('Fill all fields');
		}

		localStorage.setItem(
			'cached',
			JSON.stringify({
				apiKey: apiKey,
				workspaceId: workspaceId
			})
		);

		getTrackedTime(
			workspaceId,
			new Date(dateRange[0]).getTime(),
			new Date(dateRange[1]).getTime(),
			apiKey
		).then((data) => (trackedTime = data));
	};
</script>

<div class="w-full min-h-screen max-w-lg m-auto py-12 px-3">
	<input
		type="text"
		class="w-full rounded-md bg-zinc-800 p-2 outline-none color-white"
		placeholder="Clickup API Key"
		bind:value={apiKey}
	/>

	<input
		type="text"
		class="w-full rounded-md bg-zinc-800 p-2 outline-none color-white mt-6"
		placeholder="ClickUp Workspace ID"
		bind:value={workspaceId}
	/>

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
		class="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-2 mt-6 rounded-md mb-10"
		on:click={getTime}
	>
		Get Tracked Time
	</button>

	{#if trackedTime}
		{#each Object.keys(trackedTime) as listId}
			<div class="mt-6 w-full text-center">
				{#await getListDetails(listId, apiKey) then list}
					<div class="text-pink-500 font-bold">{list.name}</div>
				{/await}
				<div class="text-3xl">
					{`${trackedTime[listId].hours}h ${trackedTime[listId].minutes}m ${trackedTime[listId].seconds}s`}
				</div>
			</div>
		{/each}
	{/if}
</div>

<div class="absolute bottom-0 bg-black w-full text-center py-2 opacity-50">
	<a href="https://github.com/notnavindu/clickup-time-tracker"> Github </a>
</div>
