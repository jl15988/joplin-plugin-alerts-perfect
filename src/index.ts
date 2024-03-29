import joplin from 'api';
import {ContentScriptType} from 'api/types';

const pluginId = "jl15988.JoplinAlertsPerfectPlugin"

joplin.plugins.register({
    onStart: async function () {

        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            pluginId,
            './alertsPerfect.js'
        );

        await joplin.contentScripts.onMessage(pluginId, (message: any) => {
            joplin.clipboard.writeText(decodeURIComponent(message));
        });
    },
});
