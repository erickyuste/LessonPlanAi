const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");




// API Setup
const API_KEY = "AIzaSyC9iWD2Vs9ZRV00iJ7CXL7mRqypgPBQPdE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
   
}

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
const messageElement = incomingMessageDiv.querySelector(".message-text")

    // API request options
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            contents: [{
                parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data: userData.file }] : [])]
            }]
        })
    }

    try{
        //Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        //Extract and display bot's response text 
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    } catch(error) {
        //Handle error in API response
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
    }
}   



// Handle outgoing user messages
let outgoingMessageDiv; // Declare outside, but don't initialize yet

const handleOutgoingMessage = (e) => {
    
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";

    const messageContent = `<div class="message-text"></div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    outgoingMessageDiv = createMessageElement(messageContent, "user-message"); // Now initialize it
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

// Simulate bot response with thinking indicator after a delay
    setTimeout(() => {
       const messageContent = `<div class="message-text z-100 text-sm md:text-md flex my-6 border-3 rounded-xl p-3 mx-3 md:mx-0 md:p-6 border-dashed bg-[#e5e7eb] h-auto">
                <div class="card">
                    <div class="loader">
                        <p>loading</p>
                        <div class="words">
                        <span class="word">Lesson Plan</span>
                        <span class="word">Activities</span>
                        <span class="word">Assessments</span>
                        <span class="word">Strategies</span>
                        <span class="word">Assignments</span>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent);
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
        generateBotResponse(incomingMessageDiv)
    }, 600);
}



// Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e);
    }
})

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));


//LESSON PLAN BUILDER

function generateLessonPlan() {
    const gradeLevel = document.getElementById("grade-level").value;
    const subject = document.getElementById("subject").value;
    const topic = document.getElementById("topic").value;
    const coreValue = document.getElementById("core-value").value;
    const verb = document.getElementById("verb").value;
    

    const inquiryText = `Act as a professional teacher and create a unique and detailed lesson plan based on Western Australian Curriculum for grade level: ${gradeLevel} on the subject: ${subject} for the topic: ${topic}. The lesson plan should be based on Bloom's Taxonomy ${verb}. 
        It should have the following parts: 
        1. Lesson Objectives (Define clear and measurable learning objectives for a selected lesson. Specify how these objectives align with [ Input specific curriculum standards] and [input your targeted educational goals]. Describe the desired outcomes and skills students should acquire by the end of the lesson.), 
        2. Opening (includes Hook/Icebreaker and relevance to the topic), 
        3. Review of possible past Lesson,  
        4. Resources and Learning Tools(Site online resources),  
        5. Core Value Integration for ${coreValue}, 
        6. Lesson proper which will include the following:
        (6.1. Key information (Topic being discussed)
        6.2. Examples (Provide at least 5 Examples)
        6.3. Potential Misunderstanding with mitigation (Provide at least 5) 
        6.4. Engagement Strategies (Provide at least 5)
        6.5. Scaffolded Exercises (Provide at least 5)
        6.6. Indenpendent Practice) (Provide at least 5)
        6.7. Technology Integration (Identify technology tools and digital resources that will be integrated into the lesson. Explain how these technologies enhance the learning experience and support the lesson objectives. Discuss any potential challenges related to technology use and how they will be addressed during the lesson.),
        6.7. Differentiated learning (Detail how you will incorporate differentiated instruction to meet the diverse needs of students. Provide examples of instructional strategies that cater to various different learning styles and academic abilities. Explain how you will create an inclusive learning environment, considering cultural sensitivity and individual needs.),
        6.8. Inquiry-Based Questions (Provide at least 5 questioning techniques to stimulate critical thinking and curiosity.),
        6.9. Inclusive Classroom Environment (Provide at least 5 inclusive and supportive classroom environment for all students.),
        8. Assessment (Provide detailed and specific assessment.Site online resources),
        9. Assignment,
        10. Closing,
        11. Timing (time allocation of each parts).
        
        The lesson plan should be based on any existing teaching princple and modern education system and should create a different activity for every request.`; 
  
    if (messageInput) {
        messageInput.value = inquiryText; 
        sendMessageButton.click();
        outgoingMessageDiv.style.display = "none";
    }
}


const generateLesson = document.getElementById("generate-lesson-plan"); 
if (generateLesson) {
    generateLesson.addEventListener("click", generateLessonPlan);
} 

function refreshPage(){
    window.location.reload();
}


  // Add 'loaded' class when the DOM is ready
  document.addEventListener('DOMContentLoaded', (event) => {
    document.body.classList.add('loaded');
  });




