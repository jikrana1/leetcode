import { useDispatch, useSelector } from "react-redux";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { axiosClient } from "../axios/axiosClient.js";
import { addMessage } from "../slice/chatAi.slice.js";


function ChatAi({ problem }) {


    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.messages);
    console.log("messages : ", messages);











    // const [messages, setMessages] = useState([
    //     { role: "model", parts: [{ text: "👋 Hi! Ask me anything about this problem." }] },
    // ]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMsg = { role: "user", parts: [{ text: data.message }] };

        // setMessages(prev => [...prev, userMsg]);
        dispatch(addMessage(userMsg));
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMsg],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });
            console.log(response?.data?.message);

        
            dispatch(addMessage({
                role:"model",
                parts:[{text : response?.data?.message}]
            }))
        } catch (error) {
            console.log(error?.response);
            dispatch(addMessage({
                role: "model",
                parts: [{
                    text: error?.response?.data?.message
                        || "❌ Something went wrong. Please try again."
                }]
            }))
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-base-200 rounded-xl">

            {/* 🔥 HEADER */}
            <div className="p-4 border-b bg-base-100 rounded-t-xl">
                <h2 className="font-semibold text-lg">🤖 AI Assistant</h2>
                <p className="text-xs text-gray-400">
                    Ask doubts, get hints, or understand solution from DSA
                </p>
            </div>

            {/* 🔥 CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages?.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div
                            className={`chat-bubble ${msg.role === "user"
                                ? "chat-bubble-primary text-white"
                                : "bg-base-100 text-base-content"
                                }`}
                        >
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}

                {/* 🔥 LOADING */}
                {loading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-100">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 🔥 INPUT BOX */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 bg-base-100 border-t rounded-b-xl"
            >
                <div className="flex items-center gap-2">

                    <input
                        placeholder="Ask AI about this problem..."
                        className="input input-bordered flex-1"
                        {...register("message", { required: true, minLength: 2 })}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={errors.message || loading}
                    >
                        <Send size={18} />
                    </button>

                </div>
            </form>
        </div>
    );
}

export default ChatAi;