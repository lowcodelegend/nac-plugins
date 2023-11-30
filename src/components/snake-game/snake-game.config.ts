import { type PluginContract } from '@nintex/form-plugin-contract'

export const config: PluginContract = {
	controlName: '__pluginControlName__',
	groupName: '__pluginGroupName__',
	fallbackDisableSubmit: false,
	description: 'Snake Game',
	version: '1.0',
	properties: {
		bestScore: {
			type: "integer",
			title: "Best Score",
			isValueField: true //allows return data
		}        
	},	
	events: ["ntx-value-change"], //allows responding to events
	standardProperties: {
		fieldLabel: false,
		description: false,
		defaultValue: false,
		readOnly: false,
	},
}
