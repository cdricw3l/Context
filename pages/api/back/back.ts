export async function getChatResponse(userMessage: string) {
        const response = await fetch('http://localhost:3030/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_message: userMessage }),
        });
    
        const data = await response.json();
        return data.response;
}
  