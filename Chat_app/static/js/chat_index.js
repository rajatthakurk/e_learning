// Websocket Connection
let channel_name = $('#hidden_groupname').val();
const chatSocket = new WebSocket(`ws://${window.location.host}/channel-name/${channel_name}/`);

// Receive messages from server
chatSocket.onmessage = function(e){
    try{
        let server_data = JSON.parse(e.data);
        let userName = server_data['userName'];
        let userMessage = server_data['message'];
        if ($('#hidden_username').val() != userName){
            // showNotification(`${userName} - ${userMessage}`);
            // showNotification();
            // $('#chatlog').addClass('blur-effect');
            appendMessage(`<div class="message other-message"><p class="message_p"><b>${userName}: </b>${userMessage}</p><div>`);
        }
        else{
            appendMessage(`<div class="message user-message"><p class="message_p"><b>${userName}: </b>${userMessage}</p></div>`);
        }
        $('#sendMessage').attr('disabled', false);
    }
    catch{
        let userName = e.data;
        appendMessage(`<p><b>${userName} left</b></p>`);
    }
    return;
};

// Send message to server
$(document).on('click', '#sendMessage', function(){
    let message = $('#userinput').val().trim();
    if (message !== ""){
        $('#sendMessage').attr('disabled', true);
        $('#userinput').val('');
        chatSocket.send(message);
    }
    return;
})

// Show message to user
function appendMessage(message){
    var chatlog = $('#chatlog').append(message);
    chatlog.scrollTop = chatlog.scrollHeight;
    $('#chatlog').scrollTop($('#chatlog').prop('scrollHeight'));
    return;
}

// Clear chat
$(document).on('click', '.clear-chat', function(){
    if ($('#chatlog').children().length != 0){
        let result = confirm('Are you sure want to clear chat?');
        if (result == true){
            $.ajax({
                type: 'post',
                url: '/clear-delete',
                data: {'status': 'clear', 'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()},
                success: function(response){
                    if (response['status'] == true){
                        $('#chatlog').children().remove();
                    }
                    else{
                        alert('Please try again!')
                    }
                    return;
                }
            })
        }
    }
    else{
        alert('Chat already cleared.');
    }
    return;
})

// Delete group
$(document).on('click', '.delete-group', function(){
    let group_name = $('.group-name').text();
    if (group_name){
        let result = confirm('Are you sure want to delete this group?');
        if (result == true){
            $.ajax({
                type: 'post',
                url: '/clear-delete',
                data: {'status': 'delete', 'group_name': group_name, 'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()},
                success: function(response){
                    if (response['status'] == true){
                        window.location.href = '/';
                    }
                    else{
                        alert('Please try again!')
                    }
                    return;
                }
            })
        }
    }
    else{
        alert('Group name does not exists.');
    }
    return;
})