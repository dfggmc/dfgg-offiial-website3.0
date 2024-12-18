function ChatHtml() {
    var container = document.createDocumentFragment();
    var e_0 = document.createElement("div");
    var e_1 = document.createElement("style");
    e_1.appendChild(document.createTextNode("\n#ZichenChatRoomHtmlPluginChatbox {\nmax-width: 330px;\nheight: 400px;\nborder: 2px solid #ccc;\nbackground-color: #f9f9f9;\nposition: fixed;\nbottom: 50px;\nright: 50px;\nbox-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\nz-index: 1000\n}\n#ZichenChatRoomHtmlPluginChatbox .chatbox-header {\nbox-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\nbackground: rgba(255, 255, 255, 0.2);\nbackdrop-filter: blur(2.5px);\npadding: 10px;\nuser-select: none\n}\n#ZichenChatRoomHtmlPluginChatbox .chatbox-body {\nmax-height: 88%;\noverflow-y: scroll;\noverflow-x: hidden;\npadding: 10px;\nheight: calc(100% - 70px);\n}\n#ZichenChatRoomHtmlPluginChatbox .chatbox-body .message-content {\npadding: 0.75rem 1rem;\nmargin: 10px;\nborder-radius: 0.75rem;\nword-wrap: break-word;\nbackground-color: #f1f1f1;\n}\n#ZichenChatRoomHtmlPluginChatbox img {\nmax-height: 100%;\nmax-width: 100%\n}\n#ZichenChatRoomHtmlPluginChatbox .chatbox-footer {\npadding: 10px;\nposition: absolute;\nwidth: 100%;\nbottom: 0\n}\n#ZichenChatRoomHtmlPluginChatbox.collapsed .chatbox-body,\n#ZichenChatRoomHtmlPluginChatbox.collapsed .chatbox-footer {\ndisplay: none\n}\n#ZichenChatRoomHtmlPluginChatbox.collapsed {\nheight: 40px\n}\n#ZichenChatRoomHtmlPluginChatbox .chatbox-body,\n#ZichenChatRoomHtmlPluginChatbox .chatbox-footer {\nopacity: 1\n}\n#ZichenChatRoomHtmlPluginChatbox .toggleChatbox,\n#ZichenChatRoomHtmlPluginChatbox .scrollToBottom {\nfloat: right;\nbackground-color: transparent;\nborder: none;\ncursor: pointer;\nfont-size: 16px;\ntransition: transform 0.2s\n}\n@media (max-width:600px) {\n#ZichenChatRoomHtmlPluginChatbox {\nmax-width: 100%;\nwidth: 100%;\nright: 0;\nbottom: 0\n}\n}\n"));
    e_0.appendChild(e_1);
    var e_2 = document.createElement("div");
    e_2.setAttribute("class", "collapsed");
    e_2.setAttribute("id", "ZichenChatRoomHtmlPluginChatbox");
    var e_3 = document.createElement("div");
    e_3.setAttribute("class", "chatbox-header");
    e_3.appendChild(document.createTextNode("\n简易聊天室\n"));
    var e_4 = document.createElement("a");
    e_4.setAttribute("href", "https://chat.zicheng.icu/");
    e_4.setAttribute("target", "_blank");
    e_4.setAttribute("rel", "noopener noreferrer");
    e_4.appendChild(document.createTextNode("完整体验地址"));
    e_3.appendChild(e_4);
    var e_5 = document.createElement("button");
    e_5.setAttribute("class", "scrollToBottom");
    e_5.appendChild(document.createTextNode("返回底部"));
    e_3.appendChild(e_5);
    var e_6 = document.createElement("button");
    e_6.setAttribute("class", "toggleChatbox");
    e_6.appendChild(document.createTextNode("折叠"));
    e_3.appendChild(e_6);
    e_2.appendChild(e_3);
    var e_7 = document.createElement("div");
    e_7.setAttribute("class", "chatbox-body");
    e_2.appendChild(e_7);
    e_0.appendChild(e_2);
    container.appendChild(e_0);
    return container;
}
document.body.appendChild(ChatHtml());

const apiUrl = 'https://chat.zicheng.icu';
const chatbox = $("#ZichenChatRoomHtmlPluginChatbox");
const chatboxBody = chatbox.find(".chatbox-body");
let offset = 0, isCollapsed = true, firstLoad = true;

chatbox.find(".toggleChatbox").click(() => chatbox.toggleClass("collapsed"));
chatbox.find(".scrollToBottom").click(scrollToBottom);

function sendMessage(message) {
    message = message.trim();
    if (!message) return;
    $.post(`${apiUrl}/api/chat`, { message })
        .done(response => appendMessage(response.status === "success" ? message : "消息发送失败", "end"))
        .fail(() => appendMessage("消息发送失败", "end"));
}

function appendMessage(content, alignment) {
    chatboxBody.append(`<div class="message-content" style="text-align:${alignment};">${content}</div>`);
    scrollToBottom();
}

function scrollToBottom() {
    chatboxBody.scrollTop(chatboxBody[0].scrollHeight);
}

function loadMessages() {
    $.get(`${apiUrl}/api/chat`, { offset })
        .done(data => populateMessages(data.messages))
        .fail(() => appendMessage("无法加载聊天记录", "center"));
}

function populateMessages(messages) {
    if (messages.length > 0) {
        offset += messages.length;
        messages.forEach(({ type, content, user_name }) => {
            let alignment = type === "user" ? "left" : "right";
            let userDisplayName = type === "user" ? user_name : "系统";
            appendMessage(`${userDisplayName}:${content}`, alignment);
        });
        if (firstLoad) {
            scrollToBottom();
            firstLoad = false;
        }
    }
}

loadMessages();
setInterval(loadMessages, 3000);