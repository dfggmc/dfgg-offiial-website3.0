function ChatHtml() { var container = document.createDocumentFragment(); var e_0 = document.createElement("div"); var e_1 = document.createElement("style"); e_1.appendChild(document.createTextNode("\n.chatbox {\nwidth: 320px;\nheight: 400px;\nborder: 2px solid #ccc;\nbackground-color: #f9f9f9;\nposition: fixed;\nbottom: 50px;\nright: 50px;\nbox-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\nz-index: 1000\n}\n.chatbox-header {\nbox-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\nbackground: rgba(255, 255, 255, 0.2);\nbackdrop-filter: blur(2.5px);\npadding: 10px;\nuser-select: none\n}\n.chatbox-body {\nmax-height: 88%;\noverflow-y: scroll;\noverflow-x: hidden;\npadding: 10px;\nheight: calc(100% - 40px)\n}\n.chatbox-body .message-content {\npadding: 0.75rem 1rem;\nmargin: 10px;\nborder-radius: 0.75rem;\nword-wrap: break-word;\nbackground-color: #f1f1f1;\n}\n.chatbox img {\nmax-height: 100%;\nmax-width: 100%\n}\n.chatbox-footer {\npadding: 10px;\nposition: absolute;\nwidth: 100%;\nbottom: 0\n}\n.chatbox-footer input[type=\"text\"] {\nwidth: 80%;\npadding: 8px;\nborder: 1px solid #ccc;\nborder-radius: 4px\n}\n.chatbox.collapsed .chatbox-body,\n.chatbox.collapsed .chatbox-footer {\ndisplay: none\n}\n.chatbox.collapsed {\nheight: 40px\n}\n.chatbox-body,\n.chatbox-footer {\nheight: auto;\nopacity: 1\n}\n#toggleChatbox,\n#scrollToBottom {\nfloat: right;\nbackground-color: transparent;\nborder: none;\ncursor: pointer;\nfont-size: 16px;\ntransition: transform 0.2s\n}\n@media (max-width:600px) {\n.chatbox {\nwidth: 100%;\nright: 0;\nbottom: 0\n}\n}\n")); e_0.appendChild(e_1); var e_2 = document.createElement("div"); e_2.setAttribute("class", "chatbox collapsed"); e_2.setAttribute("id", "chatbox"); var e_3 = document.createElement("div"); e_3.setAttribute("class", "chatbox-header"); e_3.setAttribute("id", "chatboxHeader"); e_3.appendChild(document.createTextNode("\n简易聊天室\n")); var e_4 = document.createElement("a"); e_4.setAttribute("href", "https://chat.zicheng.icu/"); e_4.setAttribute("target", "_blank"); e_4.setAttribute("rel", "noopener noreferrer"); e_4.appendChild(document.createTextNode("完整体验地址")); e_3.appendChild(e_4); var e_5 = document.createElement("button"); e_5.setAttribute("id", "scrollToBottom"); e_5.setAttribute("onclick", "scrollToBottom()"); e_5.appendChild(document.createTextNode("返回底部")); e_3.appendChild(e_5); var e_6 = document.createElement("button"); e_6.setAttribute("id", "toggleChatbox"); e_6.appendChild(document.createTextNode("折叠")); e_3.appendChild(e_6); e_2.appendChild(e_3); var e_7 = document.createElement("div"); e_7.setAttribute("class", "chatbox-body"); e_2.appendChild(e_7); e_0.appendChild(e_2); container.appendChild(e_0); return container } document.body.appendChild(ChatHtml()); const apiUrl = 'https://chat.zicheng.icu'; const chatbox = $("#chatbox"), chatboxBody = $(".chatbox-body"), chatboxFooter = $(".chatbox-footer"); let offset = 0, isCollapsed = false, firstLoad = true; $("#toggleChatbox").click(toggleChatbox); $(".chatbox-footer input").keypress(e => { if (e.which == 13) sendMessage($(e.target).val()) }); function toggleChatbox() { chatbox.toggleClass("collapsed"); isCollapsed = !isCollapsed; if (!isCollapsed) { chatboxBody.css("height", ""); chatboxFooter.css("height", "") } } function sendMessage(message) { if (message.trim()) { $.post(`${apiUrl}/api/chat`, { message }, response => { handleSendMessageResponse(response, message) }).fail(() => appendMessage("消息发送失败", "end")) } } function handleSendMessageResponse(response, message) { appendMessage(response.status === "success" ? `${message}` : "消息发送失败", "end"); resetInputField() } function appendMessage(content, alignment) { chatboxBody.append(`<div class="message-content"style="text-align:${alignment};">${content}</div>`); scrollToBottom() } function resetInputField() { $(".chatbox-footer input").val("") } function scrollToBottom() { chatboxBody.scrollTop(chatboxBody[0].scrollHeight) } function loadMessages() { $.get(`${apiUrl}/api/chat`, { offset }, data => { populateMessages(data.messages) }).fail(() => appendMessage("无法加载聊天记录", "center")) } function populateMessages(messages) { if (messages.length > 0) { offset += messages.length; let lastFetched = messages[messages.length - 1].created_at; messages.forEach(function (message) { let alignment = message.type === "user" ? "left" : "right"; let userDisplayName = message.type === "user" ? message.user_name : "系统"; appendMessage(`${userDisplayName}:${message.content}`, alignment) }); if (firstLoad) { scrollToBottom(); firstLoad = false } } } loadMessages(); setInterval(loadMessages, 3000);