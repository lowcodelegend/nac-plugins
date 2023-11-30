import { type PluginContract } from '@nintex/form-plugin-contract'

export const config: PluginContract = {
	controlName: '__pluginControlName__',
	groupName: '__pluginGroupName__',
	fallbackDisableSubmit: false,
	description: 'Execute JS on Form',
	version: '1.0',
	properties: {  
        jsCode: {
            type: 'string',
            title: 'JS to Execute',
			description: 'Ask for examples',
			maxLength: 4096
        },
		loadjQuery: {
			type: 'boolean',
			title: 'Load jQuery',
			description: 'Automatically add jQuery 3.7.1',
			defaultValue: 'true'
		}
	},	
	events: ["ntx-value-change"], 
	standardProperties: {
		fieldLabel: true,
		description: false,
		defaultValue: false,
		readOnly: false,
		visibility: true
	},
}
