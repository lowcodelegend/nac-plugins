import { type PluginContract } from '@nintex/form-plugin-contract'
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { config } from './js-insert.config';
import { styles } from './js-insert.styles';

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

@customElement('plugin-elementname')
export class PageHighlight extends LitElement {
    static getMetaConfig = (): Promise<PluginContract> | PluginContract => config;
    static override styles = styles

    @property({ type: String})
    jsCode: string = ""
    
    @property({ type: Boolean})
    loadjQuery: boolean = true;

    override render () {
        const jqTag = document.createElement('script');
        const script = document.createElement('script');
        const js = this.jsCode;
        if(this.loadjQuery)
        {
            jqTag.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
            jqTag.crossOrigin = 'anonymous';
            jqTag.integrity = "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
            console.log('Loading jQuery');

            jqTag.onload = () => {
                console.log('jQuery loaded successfully.');
                const customScript = document.createElement('script');
                customScript.textContent = js;
                document.body.appendChild(customScript);
            };

            document.body.appendChild(jqTag);
        }
        else {
            script.textContent = this.jsCode;
            document.body.appendChild(script);
        }

        //output js to control for visbility
        return html`
            <p style="font-family: monospace">
                ${this.jsCode}
            </p>
        `
    }
}