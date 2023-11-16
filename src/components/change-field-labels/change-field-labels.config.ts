import { type PluginContract } from '@nintex/form-plugin-contract'

export const config: PluginContract = {
	controlName: '__pluginControlName__',
	groupName: '__pluginGroupName__',
	fallbackDisableSubmit: false,
	description: 'Hello World',
	version: '1.0',
	properties: {
  
        fieldMappings: {
            type: 'string',
            title: 'JSON Field Mappings to replace'
        },
		returnValues: {
			type: 'string',
			title: 'Field Values',
			isValueField: true // is for return values
		}
	},	
	events: ["ntx-value-change"], //allows responding to events
	standardProperties: {
		fieldLabel: true,
		description: false,
		defaultValue: false,
		readOnly: false,
		visibility: true
	},
}
