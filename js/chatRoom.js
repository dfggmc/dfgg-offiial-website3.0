function ChatHtml() {
    // 创建一个文档片段用于构建聊天室的 DOM 结构
    var container = document.createDocumentFragment();

    // 创建样式标签用于定义聊天室的 CSS 样式
    var e_0 = document.createElement("div");
    var e_1 = document.createElement("style");

    // 定义聊天室的样式，如尺寸、边框、背景颜色等
    e_1.appendChild(document.createTextNode(`
    .chatbox {
        width: 320px;
        height: 400px;
        border: 2px solid #ccc;
        background-color: #f9f9f9;
        position: fixed;
        bottom: 50px;
        right: 50px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 1000
    }
    .chatbox-header {
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(2.5px);
        padding: 10px;
        user-select: none
    }
    .chatbox-body {
        max-height: 88%;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 10px;
        height: calc(100% - 40px)
    }
    .chatbox-body .message-content {
        padding: 0.75rem 1rem;
        margin: 10px;
        border-radius: 0.75rem;
        word-wrap: break-word;
        background-color: #f1f1f1;
    }
    .chatbox img {
        max-height: 100%;
        max-width: 100%
    }
    .chatbox-footer {
        padding: 10px;
        position: absolute;
        width: 100%;
        bottom: 0
    }
    .chatbox-footer input[type="text"] {
        width: 80%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px
    }
    .chatbox.collapsed .chatbox-body,
    .chatbox.collapsed .chatbox-footer {
        display: none
    }
    .chatbox.collapsed {
        height: 40px
    }
    .chatbox-body,
    .chatbox-footer {
        height: auto;
        opacity: 1
    }
    #toggleChatbox,
    #scrollToBottom {
        float: right;
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-size: 16px;
        transition: transform 0.2s
    }
    @media (max-width:600px) {
        .chatbox {
            width: 100%;
            right: 0;
            bottom: 0
        }
    }
    `));
    e_0.appendChild(e_1);

    // 创建主聊天框结构，包括标题、聊天消息区域和输入区域
    var e_2 = document.createElement("div");
    e_2.setAttribute("class", "chatbox collapsed");
    e_2.setAttribute("id", "chatbox");

    // 创建聊天框标题部分
    var e_3 = document.createElement("div");
    e_3.setAttribute("class", "chatbox-header");
    e_3.setAttribute("id", "chatboxHeader");
    e_3.appendChild(document.createTextNode("\n简易聊天室\n"));

    // 创建一个链接，指向完整体验地址
    var e_4 = document.createElement("a");
    e_4.setAttribute("href", "https://chat.zicheng.icu/");
    e_4.setAttribute("target", "_blank");
    e_4.setAttribute("rel", "noopener noreferrer");
    e_4.appendChild(document.createTextNode("完整体验地址"));
    e_3.appendChild(e_4);

    // 添加“返回底部”按钮，方便用户快速滚动到底部
    var e_5 = document.createElement("button");
    e_5.setAttribute("id", "scrollToBottom");
    e_5.setAttribute("onclick", "scrollToBottom()");
    e_5.appendChild(document.createTextNode("返回底部"));
    e_3.appendChild(e_5);

    // 添加“折叠”按钮，用于折叠/展开聊天框
    var e_6 = document.createElement("button");
    e_6.setAttribute("id", "toggleChatbox");
    e_6.appendChild(document.createTextNode("折叠"));
    e_3.appendChild(e_6);
    e_2.appendChild(e_3);

    // 创建聊天内容展示区域
    var e_7 = document.createElement("div");
    e_7.setAttribute("class", "chatbox-body");
    e_2.appendChild(e_7);

    e_0.appendChild(e_2);
    container.appendChild(e_0);

    // 返回构建好的聊天框 DOM 结构
    return container;
}

const apiUrl = 'https://chat.zicheng.icu'; // 定义 API 地址
const chatbox = $("#chatbox"),
    chatboxBody = $(".chatbox-body"),
    chatboxFooter = $(".chatbox-footer");

let offset = 0, // 初始的消息偏移量
    isCollapsed = false, // 聊天框是否折叠的状态
    firstLoad = true; // 是否第一次加载消息的标志

// 绑定折叠按钮的点击事件
$("#toggleChatbox").click(toggleChatbox);

// 监听输入框按键事件，当按下 Enter 键时发送消息
$(".chatbox-footer input").keypress(e => {
    if (e.which == 13) sendMessage($(e.target).val());
});

// 折叠/展开聊天框
function toggleChatbox() {
    chatbox.toggleClass("collapsed");
    isCollapsed = !isCollapsed;
    if (!isCollapsed) {
        chatboxBody.css("height", "");
        chatboxFooter.css("height", "");
    }
}

// 发送消息函数
function sendMessage(message) {
    if (message.trim()) { // 检查消息内容是否为空
        $.post(`${apiUrl}/api/chat`, { message }, response => {
            handleSendMessageResponse(response, message);
        }).fail(() => appendMessage("消息发送失败", "end")); // 如果发送失败，显示错误信息
    }
}

// 处理消息发送后的响应
function handleSendMessageResponse(response, message) {
    appendMessage(response.status === "success" ? `${message}` : "消息发送失败", "end");
    resetInputField();
}

// 向聊天框中添加消息内容
function appendMessage(content, alignment) {
    chatboxBody.append(`<div class="message-content"style="text-align:${alignment};">${content}</div>`);
    scrollToBottom(); // 消息添加后滚动到最底部
}

// 重置输入框的内容
function resetInputField() {
    $(".chatbox-footer input").val("");
}

// 滚动到聊天框的最底部
function scrollToBottom() {
    chatboxBody.scrollTop(chatboxBody[0].scrollHeight);
}

// 加载聊天记录
function loadMessages() {
    $.get(`${apiUrl}/api/chat`, { offset }, data => {
        populateMessages(data.messages);
    }).fail(() => appendMessage("无法加载聊天记录", "center"));
}

// 将加载到的消息填充到聊天框中
function populateMessages(messages) {
    if (messages.length > 0) {
        offset += messages.length; // 更新偏移量
        let lastFetched = messages[messages.length - 1].created_at;
        messages.forEach(function (message) {
            let alignment = message.type === "user" ? "left" : "right"; // 根据消息类型决定对齐方向
            let userDisplayName = message.type === "user" ? message.user_name : "系统"; // 区分用户和系统消息
            appendMessage(`${userDisplayName}:${message.content}`, alignment);
        });
        if (firstLoad) { // 如果是第一次加载，自动滚动到底部
            scrollToBottom();
            firstLoad = false;
        }
    }
}

window.onload = function () {
    // 将聊天框 DOM 结构插入到页面中
    document.body.appendChild(ChatHtml());

    // 定时每3秒加载新的消息
    loadMessages();
    setInterval(loadMessages, 3000);
};