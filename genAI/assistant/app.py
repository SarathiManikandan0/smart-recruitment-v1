import os
import streamlit as st
import google.generativeai as genai
from dotenv import load_dotenv


def chatbotApp():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")

    # Configure Gemini AI
    genai.configure(api_key=api_key)

    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    # Initialize chat session
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    "The recruitment platform is an AI-driven solution that streamlines the hiring process through an intelligent chatbot interface. The chatbot engages with candidates to collect and manage their personal and professional information, asking targeted questions to complete fields such as full name, educational background, work experience, and interview motivation. Utilizing a large language model, the chatbot generates and refines questions based on the candidate's responses, ensuring that all necessary details are gathered. The system then visualizes candidate data using tools like radar charts to assist recruiters in evaluating and making informed decisions. Overall, the platform enhances both candidate experience and recruitment efficiency by automating and optimizing key aspects of the hiring process.",
                ],
            },
            {
                "role": "model",
                "parts": [
                    "This is a great description of an AI-driven recruitment platform! You've effectively highlighted its key features and benefits. Here's a breakdown of what stands out:\n\n**Strengths:**\n\n* **Clear and concise:** You provide a concise and easy-to-understand explanation of the platform's purpose and functionality.\n* **Focus on AI and automation:** You emphasize the role of AI, particularly the chatbot and its ability to streamline the process.\n* **Detailed features:** You specify the chatbot's functionalities, including question generation, data collection, and visualization.\n* **Emphasis on candidate experience:** You mention the platform's benefits for candidates, such as a streamlined application process.\n* **Benefits for recruiters:** You highlight how the platform helps recruiters by providing them with organized and visualized data for informed decision-making.\n\n**Possible Improvements:**\n\n* **Specificity:** You could add more details about the platform's specific AI model or the types of questions the chatbot asks.\n* **Examples:**  Consider adding examples of how the platform's visualization tools (radar charts)  help recruiters analyze candidates. \n* **Target audience:** Consider tailoring the language to the specific audience you're addressing (e.g., potential clients, candidates).\n\n**Overall:**  This is a strong description of an AI-driven recruitment platform. By focusing on its key features and benefits, you effectively communicate its value proposition. \n",
                ],
            },
            {
                "role": "user",
                "parts": [
                    "you're a HEXAWARE ASSISTANT is an advanced AI-driven recruitment chatbot designed to revolutionize the hiring process. As a sophisticated tool in the recruitment platform, HEXAWARE ASSISTANT offers a range of features that streamline interactions with candidates and optimize the hiring workflow. Here's an in-depth look at its capabilities:\n\nFeature Set\n\nPersonalized Interaction: HEXAWARE ASSISTANT engages candidates through dynamic, natural language conversations. It prompts users with tailored questions to collect essential information, such as their full name, educational background, work experience, and motivation for the interview. The chatbot uses advanced NLP techniques to understand and respond to various inputs, ensuring a smooth and intuitive user experience.\n\nAutomated Data Collection: The chatbot automates the data collection process, efficiently gathering and structuring candidate information. It asks targeted questions based on predefined fields and dynamically adapts its queries based on the candidate's responses. This approach ensures that all critical details are captured without requiring manual intervention.\n\nAI-Powered Question Generation: Leveraging a large language model, HEXAWARE ASSISTANT generates insightful and contextually relevant questions to fill in any gaps in the candidate’s profile. It can extend questions with additional guidance and context, ensuring that candidates provide comprehensive information.\n\nData Validation and Integration: The chatbot validates the collected data against the defined schema to ensure accuracy and completeness. It integrates with backend systems to update candidate profiles in real-time, maintaining a coherent and up-to-date database for recruiters.\n\nVisual Analytics: HEXAWARE ASSISTANT includes a feature for visualizing candidate data through radar charts and other graphical representations. This allows recruiters to easily assess and compare candidates based on various metrics such as motivation, educational qualifications, and work experience.\n\nStreamlined Workflow: By automating the initial stages of recruitment, HEXAWARE ASSISTANT enhances operational efficiency. It reduces the manual workload for recruiters, accelerates the hiring process, and ensures a consistent candidate experience.\n\n",
                ],
            },
        ]
    )

    # Streamlit UI with Dark Theme and Custom CSS
    # st.set_page_config(page_title="HEXAWARE ASSISTANT Chatbot", layout="wide")
    st.title("HEXAWARE ASSISTANT Chatbot")

    # Apply custom CSS for dark theme and chat styling
    st.markdown("""
        <style>
        .css-1e5nb2v { 
            background-color: #2e2e2e; 
            color: #ffffff; 
        }
        .css-1r1nizw { 
            background-color: #444444; 
            border-radius: 8px; 
            padding: 10px; 
            color: #ffffff; 
        }
        .css-1v0mbdj { 
            background-color: #333333; 
            border: 1px solid #555555; 
            border-radius: 8px; 
            padding: 10px; 
        }
        .css-1bo6g2b {
            color: #00bcd4;
        }
        .css-1f9n49s {
            color: #ff5722;
        }
        </style>
    """, unsafe_allow_html=True)

    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "assistant", "content": "Hello! How can I assist you with your recruitment needs?"}]

    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            if message["role"] == "user":
                st.markdown(f"<div class='css-1v0mbdj'>{message['content']}</div>", unsafe_allow_html=True)
            else:
                st.markdown(f"<div class='css-1r1nizw'>{message['content']}</div>", unsafe_allow_html=True)

    # Handling user input
    user_input = st.text_input("You:", "")
    if user_input:
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        # Send user input to the AI model and get a response
        chat_session.history.append({
            "role": "user",
            "parts": [user_input]
        })
        response = chat_session.send_message(user_input)
        
        st.session_state.messages.append({"role": "model", "content": response.text})

        # Display the new message
        with st.chat_message("model"):
            st.markdown(f"<div class='css-1r1nizw'>{response.text}</div>", unsafe_allow_html=True)
