(function() {
    var scriptTag = document.currentScript || document.querySelector('script[data-user-id][data-bot-id]');
    var userId = scriptTag.getAttribute('data-user-id');
    var botId = scriptTag.getAttribute('data-bot-id');
    var botSecret = scriptTag.getAttribute('data-bot-secret');
    var chat_icon = scriptTag.getAttribute('data-chat-icon');
    var chat_close_icon = scriptTag.getAttribute('data-close-icon');
    var chat_icon_popup_message = scriptTag.getAttribute('data-chat-icon-popup-message');
     var chat_icon_popup_img = scriptTag.getAttribute('data-chat-icon-popup-image');
    var current_logged_in_user_id = scriptTag.getAttribute('data-current_logged_in_user_id');

    if (current_logged_in_user_id === null) {
        current_logged_in_user_id = 0;
    }
    var domain = window.location.hostname;
    
    function initializeChat(botToken) {
        var chatIcon = document.createElement('img');
        chatIcon.src = chat_icon;
        chatIcon.classList.add('systembot_agent_open_icon');
        chatIcon.id = 'systembot_chat_open_icon';
        chatIcon.style.cssText = 'position: fixed; bottom: 20px; right: 20px; cursor: pointer; width: 40px; height: 40px; z-index: 1000;';
        if (chat_icon_popup_message && chat_icon_popup_message.trim() !== "" && chat_icon_popup_img && chat_icon_popup_img.trim() !== "") {
            var popupContainer = document.createElement('div');
            popupContainer.innerHTML = `
                <div class="popup-msg-layer" style="width: max-content; position: fixed; right: 17px; bottom: 90px; z-index: 4;">
                    <div class="popup-msg-layer-in" style="position: relative; display: flex; align-items:center; gap: 10px; background-color: #fff; border-radius: 7px; box-shadow: rgba(136, 165, 191, 0.4) 6px 2px 20px 0px, rgba(255, 255, 255, 0.3) -6px -2px 15px 0px;">
                        <div class="popup-msg-layer-left-col" style="display: flex; padding: 15px 8px; align-items: center; justify-content: center; gap: 10px; cursor:pointer;">
                            <div class="logo-layerin" style="width: 40px; height: 40px; border-radius: 50%;">
                                <img src="https://systembot.ai/wp-content/uploads/2024/08/systembot-chat-icon.png" style="object-fit: cover; width: 40px; height: 40px; border-radius: 50%;">
                            </div>
                            <div class="popup-content-in">
                                <p style="font-size: 15px; line-height: 1.3rem; color: #676767; font-weight: 400; margin-top: 0px; margin-bottom: 0px;">How may I help you?</p>
                            </div>
                        </div>
                        <div class="close-layer" style="cursor: pointer; margin-inline:10px;">
                            <svg fill="none" height="15" viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg" id="fi_2732657">
                                <path clip-rule="evenodd" d="m5.00073 17.5864c-.3905.3906-.39044 1.0237.00012 1.4142s1.02372.3905 1.41421-.0001l5.58524-5.5862 5.5857 5.5857c.3905.3905 1.0237.3905 1.4142 0s.3905-1.0237 0-1.4142l-5.5858-5.5858 5.5854-5.58638c.3904-.39056.3904-1.02372-.0002-1.41421-.3905-.3905-1.0237-.39044-1.4142.00012l-5.5853 5.58627-5.58572-5.58579c-.39052-.39052-1.02369-.39052-1.41421 0-.39053.39053-.39053 1.02369 0 1.41422l5.58593 5.58587z" fill="rgb(0,0,0)" fill-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <style>
                    .popup-msg-layer-in::after {
                        content: '';
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-right: 7px solid transparent;
                        border-left: 7px solid transparent;
                        border-top: 10px solid #fff;
                        border-bottom: 0;
                        position: absolute;
                        top: 100%;
                        right: 8%;
                    }
                </style>
            `;
            document.body.appendChild(popupContainer);
            var closeLayer = document.querySelector('.close-layer');
            var popupMsgLayer = document.querySelector('.popup-msg-layer-left-col');
            var popupMsg = document.querySelector('.popup-msg-layer');
    
            if (closeLayer && popupMsgLayer) {
                closeLayer.addEventListener('click', function() {
                    popupMsg.style.display = 'none';
                });

                popupMsgLayer.addEventListener('click', function() {
                    chatFrame.style.display = 'block';
                    closeIcon.style.display = 'block';
                    chatIcon.style.display = 'none';
                    popupMsgLayer.style.display = 'none';
                });
            }
        }
        

        var closeIcon = document.createElement('img');
        closeIcon.src = chat_close_icon;
        closeIcon.classList.add('systembot_agent_close_icon');
        closeIcon.id = 'systembot_chat_close_icon';
        closeIcon.style.cssText = 'position: fixed; bottom: 20px; right: 20px; cursor: pointer; width: 50px; height: 50px; z-index: 1000; display: none;';
        
        var chatFrame = document.createElement('iframe');
        chatFrame.style.cssText = 'position: fixed; bottom: 75px; right: 20px; max-width: 420px; width:100%; height: 500px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; z-index: 1001; display: none; box-shadow: 0px 0px 52px 10px rgba(201, 199, 201, 1); ';
        chatFrame.src = `http://localhost:8000/bot/serve_chat_bot?user_id=${encodeURIComponent(userId)}&bot_id=${encodeURIComponent(botId)}&domain=${encodeURIComponent(domain)}&bot_token=${encodeURIComponent(botToken)}`;
        if (current_logged_in_user_id) {
            chatFrame.src += `&current_logged_in_user_id=${encodeURIComponent(current_logged_in_user_id)}`;
        } else {
            chatFrame.src += `&current_logged_in_user_id=0`;
        }
        document.body.appendChild(chatIcon);
        document.body.appendChild(closeIcon);
        document.body.appendChild(chatFrame);

        chatIcon.onclick = function() {
            chatFrame.style.display = chatFrame.style.display === 'none' ? 'block' : 'none';
            closeIcon.style.display = closeIcon.style.display === 'none' ? 'block' : 'none';
            chatIcon.style.display = chatFrame.style.display === 'none' ? 'block' : 'none';
            popupMsgLayer.style.display = 'none';
        };

        closeIcon.onclick = function() {
            chatFrame.style.display = chatFrame.style.display === 'none' ? 'block' : 'none';
            closeIcon.style.display = closeIcon.style.display === 'none' ? 'block' : 'none';
            chatIcon.style.display = chatFrame.style.display === 'none' ? 'block' : 'none';
            popupMsgLayer.style.display = 'flex';
        };

    }

    function requestChatAuthorization() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8000/bot/validate_domain');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.success == true) {
                    initializeChat(response.bot_token);  // Pass the botToken to initialize chat
                }
            } else {
                console.error('Failed to authorize the domain');
            }
        };
        xhr.onerror = function() {
            console.error('Network error occurred during domain validation');
        };
        xhr.send(JSON.stringify({ 
            user_id: userId, 
            bot_id: botId, 
            domain: domain,
            bot_secret: botSecret
        }));
    }
    requestChatAuthorization();
})();
