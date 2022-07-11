import axios from 'axios';
import { timeUnits } from './helpers';

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

				let total = 0;

				itemList.forEach((session: any) => {
					total = total + parseInt(session.duration);

					durations[session.task_location.list_id] =
						parseInt(session.duration) + (durations[session.task_location.list_id] || 0);
				});

				Object.keys(durations).map((listId) => {
					durations[listId] = timeUnits(durations[listId]);
				});

				console.log(durations);

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
