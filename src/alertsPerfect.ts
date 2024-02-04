module.exports = {
    default: function (context) {
        return {
            plugin: function (markdownIt, options) {
                const alertTypes = ['success', 'warning', 'tip', 'note', 'attention', 'info'];

                const changeInline = (token) => {
                    const oneLineContent = token.content;
                    const alertInfo = oneLineContent.match(/^\[!.*.]/);
                    if (alertInfo) {
                        const alertContent = alertInfo[0];
                        let alertType = alertContent.replace("[!", "").replace("]", "").trim();
                        // 显示的标题
                        let showTitle;
                        if (alertType.includes(" ")) {
                            const blankIndex = alertType.indexOf(" ");
                            showTitle = alertType.slice(blankIndex + 1);
                            alertType = alertType.slice(0, blankIndex).toLocaleLowerCase();
                        } else {
                            alertType = alertType.toLocaleLowerCase();
                            // 开头大写
                            showTitle = alertType.charAt(0).toUpperCase() + alertType.slice(1);
                        }
                        if (alertTypes.includes(alertType)) {
                            // 标题DOM
                            const titlePElem = document.createElement("p");
                            titlePElem.classList.add("title");
                            // 图标DOM
                            const iconElem = document.createElement("span");
                            iconElem.classList.add("icon");
                            iconElem.classList.add(alertType);
                            titlePElem.appendChild(iconElem);
                            // 文本DOM
                            const typeTextElem = document.createTextNode(showTitle);
                            titlePElem.appendChild(typeTextElem);

                            return {
                                type: alertType,
                                value: titlePElem.outerHTML,
                                outValue: oneLineContent.replace(alertContent + "\n", "")
                            };
                        }
                    }
                    return {
                        type: "",
                        value: oneLineContent,
                        outValue: ""
                    };
                }

                markdownIt.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
                    console.log(tokens)
                    let index = idx;
                    let curToken = tokens[index];
                    let value = {
                        type: "",
                        value: "",
                        outValue: ""
                    };
                    do {
                        curToken = tokens[++index];
                        if (curToken.type === 'inline' && !value.type) {
                            value = changeInline(tokens[index]);
                            if (value.type) {
                                if (value.outValue) {
                                    curToken.content = value.outValue;
                                    curToken.children[0].content = value.outValue;
                                }
                                curToken.hidden = true;
                                curToken.content = "";
                                curToken.children[0].content = "";
                                // tokens = tokens.filter((item, i) => i !== index);
                            }
                        } else if (curToken.type === 'blockquote_close' && value.type) {
                            if (!options.relBlockquoteClose) {
                                options.relBlockquoteClose = [];
                            }
                            options.relBlockquoteClose.push(index);
                        }
                    } while (curToken && curToken.type !== 'blockquote_close');
                    if (!value.type || !value.value) {
                        return self.renderToken(tokens, idx, options, env, self);
                    }
                    console.log(`<div class='alerts-perfect-container ${value.type}'>${value.value}`)
                    return `<div class='alerts-perfect-container ${value.type}'>${value.value}`
                }
                markdownIt.renderer.rules.blockquote_close = function (tokens, idx, options, env, self) {
                    if (options.relBlockquoteClose && options.relBlockquoteClose.includes(idx)) {
                        return "</div>"
                    }
                    return self.renderToken(tokens, idx, options, env, self);
                }

                // markdownIt.renderer.rules.inline = function (tokens, idx, options, env, self) {
                //     // 复制按钮
                //     const token = tokens[idx];
                //     const oneLineContent = encodeURIComponent(token.content)
                //         .replace(/'/g, "\\'");
                //
                //     const alertInfo = oneLineContent.match(/^\[!.*.]/);
                //     if (alertInfo) {
                //         const alertContent = alertInfo[0];
                //         let alertType = alertContent.replace("[!", "").replace("]", "").trim();
                //         // 显示的标题
                //         let showTitle;
                //         if (alertType.includes(" ")) {
                //             const blankIndex = alertType.indexOf(" ");
                //             alertType = alertType.slice(0, blankIndex).toLocaleLowerCase();
                //             showTitle = alertType.slice(blankIndex + 1);
                //         } else {
                //             // 开头大写
                //             showTitle = alertType.charAt(0).toUpperCase() + alertType.slice(1);
                //         }
                //         if (alertTypes.includes(alertType)) {
                //             const contentElem = document.createElement("div");
                //             contentElem.classList.add("alerts-perfect-content");
                //             contentElem.classList.add(alertType);
                //
                //             // 标题DOM
                //             const titlePElem = document.createElement("p");
                //             // 图标DOM
                //             const iconElem = document.createElement("span");
                //             iconElem.classList.add("icon");
                //             iconElem.classList.add(alertType);
                //             titlePElem.appendChild(iconElem);
                //             // 文本DOM
                //             const typeTextElem = document.createTextNode(showTitle);
                //             titlePElem.appendChild(typeTextElem);
                //
                //             contentElem.appendChild(contentElem);
                //
                //             return contentElem.outerHTML + oneLineContent.replace(alertContent, "");
                //         }
                //     }
                //     return oneLineContent;
                // }
            },
            assets: function () {
                return [
                    {name: 'alertsPerfect.css'}
                ];
            },
        }
    }
}
