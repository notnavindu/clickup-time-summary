import axios from 'axios';
import { msToTime } from './helpers';

export const getTrackedTime = async (
	workspaceId: string,
	startTime: number,
	endTime: number,
	apiKey: string
) => {
	let durations: any = {};

	return await axios
		.get(
			`https://api.clickup.com/api/v2/team/${workspaceId}/time_entries?start_date=${startTime}&end_date=${endTime}`,
			{
				headers: {
					Authorization: `${apiKey}`,
					'Content-Type': 'application/json'
				}
			}
		)
		.then(
			({ data }) => {
				let itemList = data.data;

				Object.keys(data.data).map((item) => {
					durations[itemList[item].task_location.list_id] =
						parseInt(itemList[item].duration) +
						(durations[itemList[item].task_location.list_id] || 0);
				});

				Object.keys(durations).map((listId) => {
					durations[listId] = msToTime(durations[listId]);
				});

				return durations;
			},
			(err) => {
				console.error(err);
			}
		);
};

export const getListDetails = async (listId: string, apiKey: string) => {
	return await axios
		.get(`https://api.clickup.com/api/v2/list/${listId}`, {
			headers: {
				Authorization: `${apiKey}`,
				'Content-Type': 'application/json'
			}
		})
		.then(({ data }) => {
			return data;
		});
};
