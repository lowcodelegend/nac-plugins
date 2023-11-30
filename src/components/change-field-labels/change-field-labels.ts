import { type PluginContract } from '@nintex/form-plugin-contract'
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { config } from './change-field-labels.config';
import { styles } from './change-field-labels.styles';
import { addBootstrap } from '../../templates';

export type EventData<T> = {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail?: T;
}
export const defaultEventArgs = <T>(args: T): EventData<T> => ({
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: args
})

interface FieldMapping {
    name: string,
    docgentag: string
}

interface FieldMappingValues {
    [name: string]: object   
}

@customElement('plugin-elementname')
export class PageHighlight extends LitElement {
    static getMetaConfig = (): Promise<PluginContract> | PluginContract => config;
    static override styles = styles

    @property({ type: String})
    returnValues: string = ""

    @property({type: String})
    fieldMappings!: string

    private _fieldMappings: FieldMapping[] = []
    private _fieldMappingValues: FieldMappingValues = {}

    override update(changedProperties: Map<string, unknown>) {
        if (changedProperties.has("fieldMappings") && this.fieldMappings !== "") {
            this._fieldMappings = JSON.parse(this.fieldMappings)
        }
       
        super.update(changedProperties);
    }

    protected updateReturnValues = (e: Event) => {

        if (e.target) {
            const input: HTMLInputElement = e.target as HTMLInputElement;
            const fieldMapping = this._fieldMappings.find(fm => fm.name === input.id);

            if (fieldMapping) {
                this._fieldMappingValues[fieldMapping.docgentag] = {
                    fieldName: input.id,
                    value: input.value
                };
            }

            this.returnValues = JSON.stringify(this._fieldMappingValues);
            console.log(this.returnValues);
            const event = new CustomEvent('ntx-value-change', defaultEventArgs(this.returnValues));
            e.target.dispatchEvent(event);
            return event;
            }
            return undefined;
    };

    override render() {
        return html`
            ${addBootstrap()}
           
            <table class="table table-light table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Field Name</th>
                    <th scope="col">Field Value</th>
                </tr>
            </thead>
            <tbody>
                ${this._fieldMappings.map(fieldMapping => html`
                    <tr>
                        <td>
                            ${fieldMapping.name}
                        </td>
                        <td>
                            <input class="form-control" id="${fieldMapping.name}" @change=${this.updateReturnValues} />
                        </td>
                    </tr>`)}
            </tbody>
        </table>
      `
    }
}